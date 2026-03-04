"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// POST /auth - Create auth token (Firebase handles this, but endpoint for compatibility)
router.post('/', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({
                message: 'Phone number is required',
                type: 'VALIDATION_ERROR',
            });
        }
        // Firebase Auth handles phone verification on client side
        // This endpoint just returns confirmation that backend received it
        res.status(200).json({
            type: 'jwt',
            body: 'Auth handled by Firebase client SDK',
            message: 'OTP verification handled on client',
        });
    }
    catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            type: 'ERROR',
        });
    }
});
// GET /auth/verify - Verify Firebase token (optional endpoint)
router.get('/verify', auth_1.verifyAuth, async (req, res) => {
    try {
        res.status(200).json({
            message: 'Token is valid',
            userId: req.user?.uid,
            type: 'TOKEN_VALID',
        });
    }
    catch (error) {
        res.status(401).json({
            message: 'Invalid token',
            type: 'UNAUTHORIZED',
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map