export declare class ApiError extends Error {
    statusCode: number;
    type: string;
    constructor(statusCode?: number, type?: string, message?: string);
}
export declare const throwError: (statusCode: number, type: string, message?: string) => never;
//# sourceMappingURL=ApiError.d.ts.map