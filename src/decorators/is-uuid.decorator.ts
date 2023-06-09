import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const IS_UUID_NAME = 'IsUUID';
export const isUUID = (uuid: string) => {
  return typeof uuid === 'string' && UUID_REGEX.test(uuid);
};

export const IsUUID = (
  validationOptions?: ValidationOptions & { nullable?: boolean },
) => {
  return ValidateBy({
    name: IS_UUID_NAME,
    validator: {
      validate: (value: string): boolean =>
        (validationOptions.nullable &&
          (value === null || value === undefined)) ||
        isUUID(value),

      defaultMessage: buildMessage(
        (eachPrefix) => eachPrefix + '$property must be an UUID',
        validationOptions,
      ),
    },
  });
};
