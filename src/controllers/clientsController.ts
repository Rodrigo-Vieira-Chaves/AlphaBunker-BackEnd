import { Request, Response } from 'express';
import { Controller } from './Controller';
import { clientsService } from '../services/clientsService';

class ClientsController extends Controller
{
    getAllClients (req: Request, res: Response)
    {
        this.callService(res, clientsService.getAllClients.bind(clientsService));
    }

    authenticateClient (req: Request, res: Response)
    {
        this.callService(res, clientsService.authenticateClient.bind(clientsService), req.query);
    }
}

const clientsController = new ClientsController();
export { clientsController };
