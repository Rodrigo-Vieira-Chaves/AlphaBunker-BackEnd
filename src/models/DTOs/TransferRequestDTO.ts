import { AccountValidateDTO } from './AccountValidateDTO';

interface TransferRequestDTO
{
  ammount: number;
  source: AccountValidateDTO;
  destination: AccountValidateDTO;
}

export { TransferRequestDTO };
