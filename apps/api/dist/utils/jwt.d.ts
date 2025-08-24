export interface JWTPayload {
    id: string;
    email: string;
    name: string;
    role: string;
}
export declare function generateToken(payload: JWTPayload): string;
export declare function verifyToken(token: string): Promise<JWTPayload>;
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hashedPassword: string): Promise<boolean>;
//# sourceMappingURL=jwt.d.ts.map