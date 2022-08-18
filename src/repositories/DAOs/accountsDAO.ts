import { AccountDTO } from '../../models/DTOs/AccountDTO';
import { DAO } from './DAO';
import { passwordCryptography } from '../../utils/passwordCryptography';
import { v4 as uuiv4 } from 'uuid';

class AccountsDAO extends DAO
{
    getAccountByID (accountID: string)
    {
        const sql = `SELECT accountID,
                            clientID,
                            branch,
                            branchDigit,
                            accountNumber,
                            accountNumberDigit,
                            balance
                    FROM accounts WHERE accountID = ?`;

        return this.executeSQL<AccountDTO>(sql, [ accountID ]);
    }

    getAccountBalance (accountID: string)
    {
        const sql = 'SELECT balance FROM accounts WHERE accountID = ?';

        return this.executeSQL<number>(sql, [ accountID ]);
    }

    getAccountByBranchAndNumber (account: AccountDTO)
    {
        const sql = `SELECT accountID,
                            clientID,
                            branch,
                            branchDigit,
                            accountNumber,
                            accountNumberDigit,
                            balance,
                            password
                    FROM accounts
                    WHERE branch = ?
                    AND   branchDigit = ?
                    AND   accountNumber = ?
                    AND   accountNumberDigit = ?`;

        return this.executeSQL<AccountDTO>(sql,
            [
                account.branch,
                account.branchDigit,
                account.accountNumber,
                account.accountNumberDigit
            ]);
    }

    getAllAccounts ()
    {
        const sql = `SELECT accountID,
                            clientID,
                            branch,
                            branchDigit,
                            accountNumber,
                            accountNumberDigit,
                            balance
                    FROM accounts`;

        return this.executeSQL<AccountDTO>(sql, []);
    }

    getAllAccountsFromClient (clientID: string)
    {
        const sql = `SELECT accountID,
                            clientID,
                            branch,
                            branchDigit,
                            accountNumber,
                            accountNumberDigit,
                            balance,
                            password
                    FROM accounts WHERE clientID = ?`;

        return this.executeSQL<AccountDTO>(sql, [ clientID ]);
    }

    getAllAccountsFromClientWithoutPassword (clientID: string)
    {
        const sql = `SELECT accountID,
                            clientID,
                            branch,
                            branchDigit,
                            accountNumber,
                            accountNumberDigit,
                            balance
                    FROM accounts WHERE clientID = ?`;

        return this.executeSQL<AccountDTO>(sql, [ clientID ]);
    }

    createAccount (clientID: string, account: AccountDTO)
    {
        const sql = `INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                    RETURNING accountID,
                              clientID,
                              branch, 
                              branchDigit, 
                              accountNumber, 
                              accountNumberDigit, 
                              balance`;

        return this.executeSQL<AccountDTO>(sql,
            [
                uuiv4(),
                clientID,
                account.branch,
                account.branchDigit,
                account.accountNumber,
                account.accountNumberDigit,
                0,
                passwordCryptography.encryptPassword(account.password as string)
            ]);
    }

    updateAccountBalance (accountID: string, ammount: number)
    {
        const sql = `UPDATE accounts SET balance = ? WHERE accountID = ?
                    RETURNING accountID,
                              clientID,
                              branch, 
                              branchDigit, 
                              accountNumber, 
                              accountNumberDigit, 
                              balance`;

        return this.executeSQL<AccountDTO>(sql,
            [
                ammount,
                accountID
            ]);
    }
}

const accountsDAO = new AccountsDAO();
export { accountsDAO };
