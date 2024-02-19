import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsGreaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value > relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be greater than ${relatedPropertyName}`;
        },
      },
    });
  };
}

export class CreateRoomUnitPriceDto {
  @IsNotEmpty()
  @IsInt()
  before: number;

  @IsNotEmpty()
  @IsInt()
  @IsGreaterThan('before')
  current: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  buildingUnitPriceId: number;
}
