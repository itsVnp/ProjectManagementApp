import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                isEmailVerified: boolean;
                subscriptionTier: string;
            };
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireRole(roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function requireVerifiedEmail(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map