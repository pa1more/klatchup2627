"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Initialize Firebase Admin
admin.initializeApp();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        type: err.type || 'ERROR',
    });
});
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API Routes (will be imported here)
const auth_1 = __importDefault(require("./api/auth"));
const profiles_1 = __importDefault(require("./api/profiles"));
const checkIn_1 = __importDefault(require("./api/checkIn"));
const location_1 = __importDefault(require("./api/location"));
const chat_1 = __importDefault(require("./api/chat"));
app.use('/auth', auth_1.default);
app.use('/profile', profiles_1.default);
app.use('/checkin', checkIn_1.default);
app.use('/location', location_1.default);
app.use('/chat', chat_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found', type: 'NOT_FOUND' });
});
// Export as Cloud Function
exports.api = functions.https.onRequest({ region: 'us-central1' }, app);
//# sourceMappingURL=index.js.map