import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBase64OrDataUri(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBase64OrDataUri',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex = /^(data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?;base64,)?[A-Za-z0-9+/]+={0,2}$/;
          return typeof value === 'string' && regex.test(value);
        }
      }
    });
  };
}
