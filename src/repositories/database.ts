import sqlite3 from 'sqlite3';

class DatabaseInstance
{
    private readonly database: sqlite3.Database;
    private readonly DBNAME = './src/repositories/bank.db';

    private readonly SQL_TABLES_SCRIPT =
        `
            CREATE TABLE IF NOT EXISTS clients (
                clientID TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                birthday TEXT NOT NULL,
                email TEXT,
                cpf TEXT UNIQUE NOT NULL
            );

            CREATE TABLE IF NOT EXISTS accounts (
                accountID TEXT PRIMARY KEY,
                clientID TEXT NOT NULL,
                branch INT NOT NULL,
                branchDigit INT NOT NULL,
                accountNumber INT UNIQUE NOT NULL,
                accountNumberDigit INT NOT NULL,
                balance REAL NOT NULL,
                password TEXT NOT NULL,
                FOREIGN KEY (clientID) REFERENCES clients (clientID)
            );

            CREATE TABLE IF NOT EXISTS transactions (
                transactionID TEXT PRIMARY KEY,
                accountID TEXT NOT NULL,
                type TEXT NOT NULL,
                ammount INT NOT NULL,
                createdAt INT NOT NULL,
                FOREIGN KEY (accountID) REFERENCES accounts (accountID)
            );
        `;

    constructor ()
    {
        this.database = new sqlite3.Database(this.DBNAME, (err) =>
        {
            if (err)
            {
                console.log(err.message);
                throw err;
            }
            else
            {
                this.database.exec(this.SQL_TABLES_SCRIPT);
                console.log('Base de dados criada com sucesso.');
            }
        });
    }

    getDatabase ()
    {
        return this.database;
    }
}

const databaseInstance = new DatabaseInstance();
export { databaseInstance };
