import { AccountValidateDTO } from '../models/DTOs/AccountValidateDTO';
import { DepositOrWithdrawRequestDTO } from '../models/DTOs/DepositOrWithdrawRequestDTO';
import { Service } from './Service';
import { TransactionDTO } from '../models/DTOs/TransactionDTO';
import { TransactionType } from '../models/TransactionType';
import { TransferRequestDTO } from '../models/DTOs/TransferRequestDTO';
import { ValidationError } from '../errors/ValidationError';
import { accountValidator } from '../validators/accountValidator';
import { accountsService } from '../services/accountsService';
import { clientsService } from './clientsService';
import { transactionsDAO } from '../repositories/DAOs/transactionsDAO';
import { transactionsPropertiesValidator } from '../validators/transactionsPropertiesValidator';

class TransactionsService extends Service
{
    private readonly depositFee = -0.01;
    private readonly withdrawFee = -4;
    private readonly transferFee = -1;

    async getAllTransactions ()
    {
        const result = await transactionsDAO.getAllTransactions();

        return this.serviceResponseBuilder(result, 'Não há transações efetuadas.');
    }

    async getStatementsOfAccount (request: AccountValidateDTO)
    {
        const accountRetrieved = await accountValidator.validateAccountWithClient(request.clientCPF, request.account);
        accountValidator.validateAccountPassword(request.account.password as string, accountRetrieved.password as string);
        const result = await transactionsDAO.getTransactionsByAccountID(accountRetrieved.accountID as string);

        delete accountRetrieved.password;
        const echo =
        {
            client: (await clientsService.getClientByCPF(request.clientCPF)).data,
            account: accountRetrieved
        };

        return this.serviceResponseBuilder(result, 'Essa conta não possui transações.', 200, echo);
    }

    async makeDeposit (deposit: DepositOrWithdrawRequestDTO)
    {
        const accountRetrieved =
        await accountValidator.validateAccountWithClient(deposit.source.clientCPF, deposit.source.account);

        const result = await this.createTransaction(
            {
                accountID: accountRetrieved.accountID,
                ammount: deposit.ammount,
                type: TransactionType.DEPOSITO
            },
            deposit
        );

        return result;
    }

    async makeWithdraw (withdraw: DepositOrWithdrawRequestDTO)
    {
        const accountRetrieved =
        await accountValidator.validateAccountWithClient(withdraw.source.clientCPF, withdraw.source.account);
        accountValidator.validateAccountPassword(withdraw.source.account.password as string, accountRetrieved.password as string);
        await accountValidator.validateAccountBalance(accountRetrieved.accountID as string, withdraw.ammount - this.withdrawFee);

        delete withdraw.source.account.password;
        const result = await this.createTransaction(
            {
                accountID: accountRetrieved.accountID,
                ammount: -withdraw.ammount,
                type: TransactionType.SAQUE
            },
            withdraw
        );

        return result;
    }

    async makeTransfer (transfer: TransferRequestDTO)
    {
        const sourceAccount = await accountValidator.validateAccountWithClient(transfer.source.clientCPF, transfer.source.account);
        const destinationAccount = await accountValidator.validateAccountWithClient(transfer.destination.clientCPF, transfer.destination.account);

        accountValidator.validateAccountPassword(transfer.source.account.password as string, sourceAccount.password as string);
        await accountValidator.validateAccountBalance(sourceAccount.accountID as string, transfer.ammount - this.transferFee);

        if (sourceAccount.accountID === destinationAccount.accountID)
        {
            throw new ValidationError('A conta origem e a conta destino devem ser diferentes.');
        }

        delete transfer.source.account.password;
        const result = await this.createTransaction(
            {
                accountID: sourceAccount.accountID,
                ammount: -transfer.ammount,
                type: TransactionType.ENVIO_TRANSFERENCIA
            },
            transfer
        );

        await this.createTransaction(
            {
                accountID: destinationAccount.accountID,
                ammount: transfer.ammount,
                type: TransactionType.RECEBIMENTO_TRANSFERENCIA
            });

        return result;
    }

    private async createTransaction (transaction: TransactionDTO, echoObject: any = null)
    {
        transactionsPropertiesValidator.validateAll(transaction);
        const result = await transactionsDAO.createTransaction(transaction);

        await accountsService.updateAccountBalance(transaction.accountID as string, transaction.ammount);
        await this.chargeFees(transaction);

        return this.serviceResponseBuilder(result, `Erro ao criar transação do tipo ${transaction.type}`, 201, echoObject);
    }

    private async chargeFees (transaction: TransactionDTO)
    {
        switch (transaction.type)
        {
            case TransactionType.DEPOSITO:
                await this.chargeDepositFee(transaction);
                break;
            case TransactionType.SAQUE:
                await this.chargeWithdrawFee(transaction);
                break;
            case TransactionType.ENVIO_TRANSFERENCIA:
                await this.chargeTransferFee(transaction);
                break;
            default:
                break;
        }
    }

    private async chargeDepositFee (transaction: TransactionDTO)
    {
        transaction.type = TransactionType.TAXA_DE_DEPOSITO;
        transaction.ammount *= this.depositFee;

        await this.createTransaction(transaction);
    }

    private async chargeWithdrawFee (transaction: TransactionDTO)
    {
        transaction.type = TransactionType.TAXA_DE_SAQUE;
        transaction.ammount = this.withdrawFee;

        await this.createTransaction(transaction);
    }

    private async chargeTransferFee (transaction: TransactionDTO)
    {
        transaction.type = TransactionType.TAXA_DE_TRANSFERENCIA;
        transaction.ammount = this.transferFee;

        await this.createTransaction(transaction);
    }
}

const transactionsService = new TransactionsService();
export { transactionsService };
