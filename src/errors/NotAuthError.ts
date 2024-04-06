import { AUTH_ERROR } from '../constants';

export default class NotAuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = AUTH_ERROR;
  }
}
