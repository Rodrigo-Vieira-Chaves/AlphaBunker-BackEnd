import { AccountDTO } from '../models/DTOs/AccountDTO';
import { InsufficientBalanceError } from '../errors/InsufficientBalanceError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { accountsPropertiesValidator } from './accountsPropertiesValidator';
import { accountsService } from '../services/accountsService';
import { clientsPropertiesValidator } from './clientsPropertiesValidator';
import { clientsService } from '../services/clientsService';
import { passwordCryptography } from '../utils/passwordCryptography';

class AccountValidator
{
    async validateAccountWithClient (clientCPF: string, account: AccountDTO)
    {
        clientsPropertiesValidator.validateCPF(clientCPF);

        const clientID = (await clientsService.getClientByCPF(clientCPF)).data.clientID as string;
        const accountRetrieved = (await accountsService.getAccountByBranchAndNumber(account)).data as AccountDTO;

        if (accountRetrieved.clientID !== clientID) throw new UnauthorizedError(`O cliente ${clientCPF} não é dono da conta informada.`);


        return accountRetrieved;
    }

    validateAccountPassword (password: string, hashedPassword: string)
    {
        accountsPropertiesValidator.validateAccountPassword(password);

        if (!passwordCryptography.comparePassword(password, hashedPassword)) throw new UnauthorizedError('Senha incorreta.');

    }

    async validateAccountBalance (accountID: string, balanceComparison: number)
    {
        const accountBalance = (await accountsService.getAccountBalance(accountID as string)).data.balance as number;

        if (accountBalance < balanceComparison) throw new InsufficientBalanceError('Essa conta não possui saldo suficiente');

    }
}

const accountValidator = new AccountValidator();
export { accountValidator };
