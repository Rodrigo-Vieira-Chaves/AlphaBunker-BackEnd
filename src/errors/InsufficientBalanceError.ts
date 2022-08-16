import { BackEndErrors } from './BackEndErrors';

class InsufficientBalanceError extends BackEndErrors
{
    public code = 402;
}

export { InsufficientBalanceError };
