import { Request, Response } from 'express';
import { Controller } from './Controller';
import { accountsService } from '../services/accountsService';

class AccountsController extends Controller
{
    getClientAccounts (req: Request, res: Response)
    {
        this.callService(res, accountsService.getClientAccounts.bind(accountsService), req.params);
    }

    createAccount (req: Request, res: Response)
    {
        this.callService(res, accountsService.createAccount.bind(accountsService), req.body);
    }
}

const accountsController = new AccountsController();
export { accountsController };
