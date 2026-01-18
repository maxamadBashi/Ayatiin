const { prisma } = require('../config/db');

const logActivity = (action) => {
    return async (req, res, next) => {
        const originalJson = res.json;
        res.json = function (data) {
            res.locals.responseData = data;
            return originalJson.apply(this, arguments);
        };

        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                try {
                    await prisma.auditLog.create({
                        data: {
                            userId: req.user.id,
                            action: `${req.method} ${req.originalUrl}`,
                            details: JSON.stringify({
                                body: req.body,
                                status: res.statusCode,
                                action
                            })
                        }
                    });
                } catch (err) {
                    console.error('Logging error:', err.message);
                }
            }
        });
        next();
    };
};

module.exports = logActivity;
