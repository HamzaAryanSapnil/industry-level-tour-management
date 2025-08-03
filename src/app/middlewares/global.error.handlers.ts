/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../Error-Helpers/App-Error";
import { ZodIssue } from "zod";
import { IErrorSources } from "../interfaces/error.types";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleCastError } from "../helpers/handleCastError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";

export const globalErrorHandlers = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (envVars.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(err)
  }

  let statusCode = 500;
  let message = `Something went wrong.`;
  let errorDetails: any = null;

  let errorSources: IErrorSources[] = [];

  // !  Duplicate Error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // ! Object Id Cast error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // ! Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);

    statusCode = simplifiedError.statusCode;

    errorSources = simplifiedError.errorSources as IErrorSources[];
    message = simplifiedError.message;
  }
  // ! Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = err.issues.map((issue: ZodIssue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
    errorSources = simplifiedError?.errorSources as IErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
