import { AccountDTO } from '../models/DTOs/AccountDTO';
import { accountsPropertiesValidator } from '../validators/accountsPropertiesValidator';

function generateRandomAccount ()
{
    let randomAccount = {} as AccountDTO;
    let isInvalidAccount = true;

    while (isInvalidAccount)
    {
        try
        {
            randomAccount =
                {
                    branch: Math.floor(Math.random() * 10000),
                    branchDigit: Math.floor(Math.random() * 10),
                    accountNumber: Math.floor(Math.random() * 100000000),
                    accountNumberDigit: Math.floor(Math.random() * 10),
                    password: String(Math.floor(Math.random() * 10000))
                };

            accountsPropertiesValidator.validateAll(randomAccount);
            isInvalidAccount = false;
        }
        catch (error)
        {
            // eslint-disable-next-line no-empty
        }
    }

    return randomAccount;
}

export { generateRandomAccount };
