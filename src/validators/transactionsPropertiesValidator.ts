import { PropertiesValidator } from './PropertiesValidator';
import { TransactionDTO } from '../models/DTOs/TransactionDTO';
import { ValidationError } from '../errors/ValidationError';

class TransactionsPropertiesValidator extends PropertiesValidator
{
    private readonly allValidators = [ this.validateAmmount.bind(this) ];

    validateAll (transaction: TransactionDTO)
    {
        const params = [ transaction.ammount ];

        this.validateAllProperties(this.allValidators, params);
    }

    validateAmmount (ammount: number)
    {
        if (ammount === 0) throw new ValidationError('Valor de uma transação deve ser um número maior ou menor que 0.');
    }
}

const transactionsPropertiesValidator = new TransactionsPropertiesValidator();
export { transactionsPropertiesValidator };
