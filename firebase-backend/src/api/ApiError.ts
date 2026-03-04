export class ApiError extends Error {
  constructor(
    public statusCode: number = 500,
    public type: string = 'ERROR',
    message: string = 'Internal Server Error'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const throwError = (
  statusCode: number,
  type: string,
  message: string = 'Error'
) => {
  throw new ApiError(statusCode, type, message);
};
