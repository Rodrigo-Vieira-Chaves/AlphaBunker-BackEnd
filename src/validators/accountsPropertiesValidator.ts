import { AccountDTO } from '../models/DTOs/AccountDTO';
import { PropertiesValidator } from './PropertiesValidator';
import { ValidationError } from '../errors/ValidationError';

class AccountsPropertiesValidator extends PropertiesValidator
{
    private readonly branchLength = 4;
    private readonly accountNumberLength = 8;

    private readonly passwordRegex = /^[0-9]{4,8}$/;

    private readonly allValidators =
        [
            this.validateBranch.bind(this),
            this.validateBranchDigit.bind(this),
            this.validateAccountNumber.bind(this),
            this.validateAccountNumberDigit.bind(this),
            this.validateAccountPassword.bind(this)
        ];

    validateAll (account: AccountDTO)
    {
        const params =
        [
            account.branch,
            account.branchDigit,
            account.accountNumber,
            account.accountNumberDigit,
            account.password
        ];

        this.validateAllProperties(this.allValidators, params);
    }

    validateBranch (branch: number)
    {
        if (branch < 0 || String(branch).length !== this.branchLength)
        {
            throw new ValidationError(`Favor providenciar número da agência em forma numérica de ${this.branchLength} dígitos, positivo.`);
        }
    }

    validateBranchDigit (branchDigit: number)
    {
        if (branchDigit < 0 || branchDigit > 9)
        {
            throw new ValidationError('Favor providenciar dígito verificador da agência utilizando um número entre 0 a 9.');
        }
    }

    validateAccountNumber (accountNumber: number)
    {
        if (accountNumber < 0 || String(accountNumber).length !== this.accountNumberLength)
        {
            throw new ValidationError(`Favor providenciar número da conta em forma numérica de ${this.accountNumberLength} dígitos, positivo.`);
        }
    }

    validateAccountNumberDigit (accountNumberDigit: number)
    {
        if (accountNumberDigit < 0 || accountNumberDigit > 9)
        {
            throw new ValidationError('Favor providenciar dígito verificador da conta bancária utilizando um número entre 0 a 9.');
        }
    }

    validateAccountPassword (password: string)
    {
        if (!this.passwordRegex.test(password))
        {
            throw new ValidationError('Favor providenciar uma senha de 4 a 8 dígitos inteiros.');
        }
    }
}

const accountsPropertiesValidator = new AccountsPropertiesValidator();
export { accountsPropertiesValidator };
