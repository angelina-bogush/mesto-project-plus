import { DATA_NOT_FOUND } from '../constants';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = DATA_NOT_FOUND;
  }
}
