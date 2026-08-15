import { ValidationError } from './errors.js';

export const validateSchema = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    throw new ValidationError('Validation Error', errorDetails);
  }
  return result.data;
};
export default validateSchema;
