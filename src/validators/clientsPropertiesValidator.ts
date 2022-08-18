import { ClientDTO } from '../models/DTOs/ClientDTO';
import { PropertiesValidator } from './PropertiesValidator';
import { ValidationError } from '../errors/ValidationError';

class ClientsPropertiesValidator extends PropertiesValidator
{
    private readonly nameRegex = /^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/;
    private readonly emailRegex = /^(\S+)@((?:(?:(?!-)[a-zA-Z0-9-]{1,62}[a-zA-Z0-9])\.)+[a-zA-Z0-9]{2,12})$/;
    private readonly cpfRegex = /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)/;

    private readonly allValidators =
        [
            this.validateName.bind(this),
            this.validateBirthday.bind(this),
            this.validateEmail.bind(this),
            this.validateCPF.bind(this)
        ];

    validateAll (client: ClientDTO)
    {
        const params =
        [
            client.name,
            client.birthday,
            client.email,
            client.cpf
        ];

        this.validateAllProperties(this.allValidators, params);
    }

    validateName (name: string)
    {
        if (!this.nameRegex.test(name)) throw new ValidationError('Nome do usuário deve possuir nome e sobrenome e não pode ter números ou caracteres especiais.');
    }

    validateBirthday (birthday: string)
    {
        const birth = birthday.split('-');
        if (isNaN(Date.parse(`${birth[2]}-${birth[1]}-${birth[0]}`))) throw new ValidationError('A data de aniversário deve possuir o formato: DD-MM-YYYY e deve ser uma data válida.');
    }

    validateEmail (email: string)
    {
        if (!this.emailRegex.test(email)) throw new ValidationError('Favor providenciar email no formato: \'email@provedor.extensao\'.');
    }

    validateCPF (cpf: string)
    {
        if (!this.cpfRegex.test(cpf)) throw new ValidationError('Favor providenciar CPF no formato: \'000.000.000-00\'.');
    }
}

const clientsPropertiesValidator = new ClientsPropertiesValidator();
export { clientsPropertiesValidator };
