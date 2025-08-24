"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/profile', (req, res) => {
    res.json({
        success: true,
        message: 'User profile endpoint - to be implemented'
    });
});
router.put('/profile', (req, res) => {
    res.json({
        success: true,
        message: 'Update user profile endpoint - to be implemented'
    });
});
exports.default = router;
//# sourceMappingURL=users.js.map