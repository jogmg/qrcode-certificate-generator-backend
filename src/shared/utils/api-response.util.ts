export class ApiResponse<T> {
  constructor(
    public readonly error: boolean,
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data?: T,
    // public readonly pagination?: {
    //   page: number;
    //   limit: number;
    //   total: number;
    // },
  ) {}
}
