import { TransactionType } from '../TransactionType';

interface TransactionDTO
{
  transactionID?: string;
  accountID?: string;
  type: TransactionType;
  ammount: number;
}

export { TransactionDTO };
