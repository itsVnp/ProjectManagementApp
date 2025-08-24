"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
        message: 'The requested resource was not found on this server'
    });
}
//# sourceMappingURL=not-found.js.map