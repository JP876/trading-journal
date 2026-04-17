import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCommaSeparatedNumbers(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isCommaSeparatedNumbers',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const parts = value.split(',').map((part) => part.trim());
          if (parts.some((part) => part === '')) return false;
          return !parts.some((p) => isNaN(+p) || !Number.isInteger(+p));
        },
        defaultMessage() {
          return 'Each value must be a valid integer separated by commas.';
        },
      },
    });
  };
}
