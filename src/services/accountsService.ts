import { AccountCreateDTO } from '../models/DTOs/AccountCreateDTO';
import { AccountDTO } from '../models/DTOs/AccountDTO';
import { EmptyError } from '../errors/EmptyError';
import { Service } from './Service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { accountsDAO } from '../repositories/DAOs/accountsDAO';
import { accountsPropertiesValidator } from '../validators/accountsPropertiesValidator';
import { clientsPropertiesValidator } from '../validators/clientsPropertiesValidator';
import { clientsService } from './clientsService';
import { generateRandomAccount } from '../utils/generateRandomAccount';
import { passwordCryptography } from '../utils/passwordCryptography';

class AccountsService extends Service
{
    async getAccountByID (accountID: string)
    {
        const result = await accountsDAO.getAccountByID(accountID);

        return this.serviceResponseBuilder(result, `A conta ${accountID} não existe.`);
    }

    async getAccountByBranchAndNumber (account: AccountDTO)
    {
        accountsPropertiesValidator.validateBranch(account.branch);
        accountsPropertiesValidator.validateBranchDigit(account.branchDigit);
        accountsPropertiesValidator.validateAccountNumber(account.accountNumber);
        accountsPropertiesValidator.validateAccountNumberDigit(account.accountNumberDigit);
        const result = await accountsDAO.getAccountByBranchAndNumber(account);

        return this.serviceResponseBuilder(result, `Essa Agência/Conta não existe: Ag: ${account.branch}-${account.branchDigit} Conta: ${account.accountNumber}-${account.accountNumberDigit}`);
    }

    async getClientAccounts (clientCPF: { cpf: string })
    {
        const client = await clientsService.getClientByCPF(clientCPF.cpf);
        const result = await accountsDAO.getAllAccountsFromClientWithoutPassword(client.data.clientID);

        return this.serviceResponseBuilder(result, 'Esse cliente não possui contas cadastradas.');
    }

    async getAccountByClientIDAndPassword (clientID: string, password: string)
    {
        const accounts = await accountsDAO.getAllAccountsFromClient(clientID);

        const result = accounts.find((account) => passwordCryptography.comparePassword(password, account.password as string));

        return this.serviceResponseBuilder(result ? [ result ] : [], 'Senha informada não está correta.');
    }

    async getAccountBalance (accountID: string)
    {
        const result = await accountsDAO.getAccountBalance(accountID);

        return this.serviceResponseBuilder(result, `A conta ${accountID} não existe.`);
    }

    async createAccount (newAccount: AccountCreateDTO)
    {
        accountsPropertiesValidator.validateAccountPassword(newAccount.password);
        clientsPropertiesValidator.validateAll(newAccount.client);

        let clientID = '';
        try
        {
            clientID = (await clientsService.getClientByCPF(newAccount.client.cpf)).data.clientID as string;
        }
        catch (error)
        {
            if (!(error instanceof EmptyError)) throw error;

            clientID = (await clientsService.createClient(newAccount.client)).data.clientID as string;
        }

        // Check if already there is an account with the same password.
        const accountsList = await accountsDAO.getAllAccountsFromClient(clientID);
        const isPasswordRepeated = accountsList.find((account) => passwordCryptography.comparePassword(newAccount.password, account.password as string));

        if (isPasswordRepeated) throw new UnauthorizedError('Cliente já usou essa senha em outra conta.');

        const randomAccount = generateRandomAccount();
        randomAccount.password = newAccount.password;

        const result = await accountsDAO.createAccount(clientID, randomAccount);

        return this.serviceResponseBuilder(result, 'Erro ao inserir conta.', 201, newAccount.client);
    }

    async updateAccountBalance (accountID: string, ammount: number)
    {
        const accountBalance = (await this.getAccountBalance(accountID)).data.balance as number;
        await accountsDAO.updateAccountBalance(accountID, accountBalance + ammount);
    }
}

const accountsService = new AccountsService();
export { accountsService };
