import { Request, Response } from 'express';
import { Controller } from './Controller';
import { transactionsService } from '../services/transactionsService';

class TransactionsController extends Controller
{
    async getStatementsOfAccount (req: Request, res: Response)
    {
        this.callService(res, transactionsService.getStatementsOfAccount.bind(transactionsService), req.body);
    }

    async makeDeposit (req: Request, res: Response)
    {
        this.callService(res, transactionsService.makeDeposit.bind(transactionsService), req.body);
    }

    async makeWithdraw (req: Request, res: Response)
    {
        this.callService(res, transactionsService.makeWithdraw.bind(transactionsService), req.body);
    }

    async makeTransfer (req: Request, res: Response)
    {
        this.callService(res, transactionsService.makeTransfer.bind(transactionsService), req.body);
    }
}

const transactionsController = new TransactionsController();
export { transactionsController };
