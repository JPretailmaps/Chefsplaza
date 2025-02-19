import { HttpException } from '@nestjs/common';
import {
  ACCOUNT_INACTIVE, ACCOUNT_EXISTED, ACCOUNT_NOT_FOUND, CANNOT_AUTHENTICATE, EMAIL_NOT_VERIFIED, PASSWORD_INCORRECT
} from '../constants';

export class AccountExistedException extends HttpException {
  constructor() {
    super(ACCOUNT_EXISTED, 422);
  }
}

export class AccountInactiveException extends HttpException {
  constructor() {
    super(ACCOUNT_INACTIVE, 403);
  }
}

export class AccountNotFoundxception extends HttpException {
  constructor() {
    super(ACCOUNT_NOT_FOUND, 404);
  }
}

export class AuthErrorException extends HttpException {
  constructor() {
    super(CANNOT_AUTHENTICATE, 403);
  }
}

export class EmailNotVerifiedException extends HttpException {
  constructor() {
    super(EMAIL_NOT_VERIFIED, 422);
  }
}

export class PasswordIncorrectException extends HttpException {
  constructor() {
    super(PASSWORD_INCORRECT, 422);
  }
}
