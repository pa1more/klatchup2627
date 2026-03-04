"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode = 500, type = 'ERROR', message = 'Internal Server Error') {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
const throwError = (statusCode, type, message = 'Error') => {
    throw new ApiError(statusCode, type, message);
};
exports.throwError = throwError;
//# sourceMappingURL=ApiError.js.map