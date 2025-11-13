"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.validateEnv = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    FIREBASE_PROJECT_ID: zod_1.z.string(),
    STRIPE_SECRET_KEY: zod_1.z.string(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string(),
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string(),
    SENTRY_DSN: zod_1.z.string().optional(),
});
const validateEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error('Environment validation failed:', error);
        throw new Error('Invalid environment configuration');
    }
};
exports.validateEnv = validateEnv;
exports.env = (0, exports.validateEnv)();
//# sourceMappingURL=env.js.map