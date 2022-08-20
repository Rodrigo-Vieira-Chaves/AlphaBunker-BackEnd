import { ClientDTO } from './ClientDTO';

interface AccountCreateDTO
{
  client: ClientDTO;
  password: string;
}

export { AccountCreateDTO };
