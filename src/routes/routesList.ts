import express, { Express } from 'express';
import { accountsController } from '../controllers/accountsController';
import { authToken } from '../middlewares/AuthToken';
import { clientsController } from '../controllers/clientsController';
import { transactionsController } from '../controllers/transactionsController';

class Routes
{
    initRoutes (app: Express)
    {
        // TODO do not leave this endpoint hanging...
        app.use('/getAllClients', this.getAllClients());
        app.use('/authenticateClient', this.authenticateClient());
        app.use('/getClientAccounts', this.getClientAccounts());
        app.use('/createAccount', this.configCreateAccountRoutes());
        app.use('/makeDeposit', this.configMakeDepositRoutes());
        app.use('/makeWithdraw', this.configMakeWithdrawRoutes());
        app.use('/makeTransfer', this.configMakeTransferRoutes());
        app.use('/getStatements', this.configGetStatementsRoutes());
    }

    private getAllClients ()
    {
        const getAllClientsRoutes = express.Router();
        getAllClientsRoutes.get('/', clientsController.getAllClients.bind(clientsController));

        return getAllClientsRoutes;
    }

    private authenticateClient ()
    {
        const authenticateClientRoutes = express.Router();
        authenticateClientRoutes.get('/', clientsController.authenticateClient.bind(clientsController));

        return authenticateClientRoutes;
    }

    private configCreateAccountRoutes ()
    {
        const createAccountRoutes = express.Router();
        createAccountRoutes.post('/', accountsController.createAccount.bind(accountsController));

        return createAccountRoutes;
    }

    private getClientAccounts ()
    {
        const getClientAccountsRoutes = express.Router();
        getClientAccountsRoutes.get('/:cpf', authToken.validateToken.bind(authToken), accountsController.getClientAccounts.bind(accountsController));

        return getClientAccountsRoutes;
    }

    private configMakeDepositRoutes ()
    {
        const makeDepositRoutes = express.Router();
        makeDepositRoutes.post('/', authToken.validateToken.bind(authToken), transactionsController.makeDeposit.bind(transactionsController));

        return makeDepositRoutes;
    }

    private configMakeWithdrawRoutes ()
    {
        const makeWithdrawRoutes = express.Router();
        makeWithdrawRoutes.post('/', authToken.validateToken.bind(authToken), transactionsController.makeWithdraw.bind(transactionsController));

        return makeWithdrawRoutes;
    }

    private configMakeTransferRoutes ()
    {
        const makeTransferRoutes = express.Router();
        makeTransferRoutes.post('/', authToken.validateToken.bind(authToken), transactionsController.makeTransfer.bind(transactionsController));

        return makeTransferRoutes;
    }

    private configGetStatementsRoutes ()
    {
        const getStatementsRoutes = express.Router();
        getStatementsRoutes.post('/', authToken.validateToken.bind(authToken), transactionsController.getStatementsOfAccount.bind(transactionsController));

        return getStatementsRoutes;
    }
}

const routes = new Routes();
export { routes };
