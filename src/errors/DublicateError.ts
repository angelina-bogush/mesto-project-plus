import { DUBLICATE_ERROR } from '../constants';

export default class DublicateError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = DUBLICATE_ERROR;
  }
}
