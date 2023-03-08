import { ValidationError } from "apollo-server";

const handleCastError = (error: ValidationError) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  throw new ValidationError(message);
};

const handleValidationError = (error: ValidationError) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = Object.values(error.errors).map((el: any) => el.message);
  throw new ValidationError(`Invalid input: ${message.join(", ")}`);
};

const errorHandler = (error: ValidationError) => {
  if (error.name === "CastError") handleCastError(error);
  if (error.name === "ValidationError") handleValidationError(error);
  throw error;
};

export default errorHandler;
