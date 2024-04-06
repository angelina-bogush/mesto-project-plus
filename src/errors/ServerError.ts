import { DATA_NOT_FOUND, VALIDATION_ERROR, SERVER_ERROR, AUTH_ERROR, ACCESS_ERROR } from '../constants';

export default class ServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = SERVER_ERROR;
  }
}
