import { ACCESS_ERROR } from '../constants';

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ACCESS_ERROR;
  }
}
