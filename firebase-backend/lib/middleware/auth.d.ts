import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
export declare const verifyAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}
//# sourceMappingURL=auth.d.ts.map