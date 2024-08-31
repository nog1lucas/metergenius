import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEnumCaseInsensitive(enumType: object, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumCaseInsensitive',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const enumValues = Object.values(args.constraints[0]) as string[];
          return enumValues.some(enumValue => enumValue.toLowerCase() === value.toLowerCase());
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of the following values: ${Object.values(args.constraints[0]).join(', ')}`;
        },
      },
    });
  };
}
