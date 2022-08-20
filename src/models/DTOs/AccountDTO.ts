interface AccountDTO
{
  accountID?: string;
  clientID?: string;
  branch: number;
  branchDigit: number;
  accountNumber: number;
  accountNumberDigit: number;
  password?: string;
  balance?: number;
}

export { AccountDTO };
