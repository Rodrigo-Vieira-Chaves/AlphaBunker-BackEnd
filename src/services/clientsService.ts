import { AccountDTO } from '../models/DTOs/AccountDTO';
import { ClientDTO } from '../models/DTOs/ClientDTO';
import { Service } from './Service';
import { accountsService } from './accountsService';
import { authToken } from '../middlewares/AuthToken';
import { clientsDAO } from '../repositories/DAOs/clientsDAO';
import { clientsPropertiesValidator } from '../validators/clientsPropertiesValidator';

class ClientsService extends Service
{
    async getClientByID (clientID: string)
    {
        const result = await clientsDAO.getClientByID(clientID);

        return this.serviceResponseBuilder(result, `O cliente ${clientID} não existe.`);
    }

    async getClientByCPF (cpf: string)
    {
        clientsPropertiesValidator.validateCPF(cpf);
        const result = await clientsDAO.getClientByCPF(cpf);

        return this.serviceResponseBuilder(result, `O cliente ${cpf} não existe`);
    }

    async getAllClients ()
    {
        const result = await clientsDAO.getAllClients();

        return this.serviceResponseBuilder(result, 'Não há clientes cadastrados.');
    }

    async authenticateClient (cpfAndPassword: {cpf: string, password: string})
    {
        const client = (await this.getClientByCPF(cpfAndPassword.cpf)).data as ClientDTO;
        const account = (await accountsService.getAccountByClientIDAndPassword(client.clientID as string, cpfAndPassword.password)).data as AccountDTO;

        delete account.password;

        const result =
        {
            client,
            account,
            token: authToken.generateToken({ clientCPF: client.cpf, password: cpfAndPassword.password })
        };

        return this.serviceResponseBuilder([ result ], '');
    }

    async createClient (client: ClientDTO)
    {
        clientsPropertiesValidator.validateAll(client);
        const result = await clientsDAO.createClient(client);

        return this.serviceResponseBuilder(result, 'Erro ao inserir cliente.', 201);
    }
}

const clientsService = new ClientsService();
export { clientsService };
