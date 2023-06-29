


export enum Status {
    SUCCESS = 'SUCCESS',
    INVALID_PARAMETER = 'INVALID_PARAMETER',
    MISSING_PARAMETER = 'MISSING_PARAMETER',
    DATA_NOT_FOUND = 'DATA_NOT_FOUND',
    UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
    UNACCEPTABLE_REDUNDANCY = 'UNACCEPTABLE_REDUNDANCY',
    ALREADY_DONE = 'ALREADY_DONE',
    UNHANDLED_SCENARIO = 'UNHANDLED_SCENARIO',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    USER_TYPE_UNAUTHORIZED = 'USER_TYPE_UNAUTHORIZED',
    METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
    BAD_REQUEST = 'BAD_REQUEST',
    DATA_ALREADY_EXISTS = "DATA_ALREADY_EXISTS"
}

    

interface Response<T> {
    message: string;
    status: Status;
    items?: T | T[];
}

export type Error = {
    message:string
    code:Status
}

export function getErrorStatusColor(status: Status): string {
    switch (status) {
      case Status.SUCCESS:
        return 'green';

      case Status.INVALID_PARAMETER:
      case Status.MISSING_PARAMETER:
      case Status.UNACCEPTABLE_REDUNDANCY:
      case Status.INVALID_CREDENTIALS:
      case Status.USER_TYPE_UNAUTHORIZED:
        return 'yellow';
      case Status.DATA_NOT_FOUND:
      case Status.TOKEN_NOT_FOUND:
        return 'orange';
      case Status.UNEXPECTED_ERROR:
      case Status.ALREADY_DONE:
      case Status.UNHANDLED_SCENARIO:
      case Status.TOKEN_EXPIRED:
        return 'red';
      default:
        return 'gray';
    }
  }
export default Response
