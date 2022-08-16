import { AccountValidateDTO } from './AccountValidateDTO';

interface DepositOrWithdrawRequestDTO
{
  ammount: number;
  source: AccountValidateDTO;
}

export { DepositOrWithdrawRequestDTO };
