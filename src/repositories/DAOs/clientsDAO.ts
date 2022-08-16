import { ClientDTO } from '../../models/DTOs/ClientDTO';
import { DAO } from './DAO';
import { v4 as uuiv4 } from 'uuid';

class ClientsDAO extends DAO
{
    getClientByID (clientID: string)
    {
        const sql = `SELECT clientID,
                            name,
                            birthday,
                            email,
                            cpf
                    FROM clients WHERE clientID = ?`;

        return this.executeSQL<ClientDTO>(sql, [ clientID ]);
    }

    getClientByCPF (cpf: string)
    {
        const sql = `SELECT clientID,
                            name,
                            birthday,
                            email,
                            cpf
                    FROM clients WHERE cpf = ?`;

        return this.executeSQL<ClientDTO>(sql, [ cpf ]);
    }

    getAllClients ()
    {
        const sql = `SELECT clientID,
                            name,
                            birthday,
                            email,
                            cpf
                    FROM clients`;

        return this.executeSQL<ClientDTO>(sql, []);
    }

    createClient (client: ClientDTO)
    {
        const sql = 'INSERT INTO clients VALUES (?, ?, ?, ?, ?) RETURNING *';

        return this.executeSQL<ClientDTO>(sql,
            [
                uuiv4(),
                client.name,
                client.birthday,
                client.email,
                client.cpf
            ]);
    }
}

const clientsDAO = new ClientsDAO();
export { clientsDAO };
