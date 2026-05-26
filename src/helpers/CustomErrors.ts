import { HTTP_STATUS_CODES } from "./constants";

export class AlreadyExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExistError";
  }
}

export class OperationFailedError extends Error {
  public statusCode: number;
  constructor(
    message: string,
    statusCode: number = HTTP_STATUS_CODES.badRequest,
  ) {
    super(message);
    this.name = "OperationFailedError";
    this.statusCode = statusCode;
  }
}

export class UnAuthorizedError extends Error {
  constructor(message: string = "UnAuthorized action") {
    super(message);
    this.name = "UnAuthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden action") {
    super(message);
    this.name = "ForbiddenError";
  }
}
