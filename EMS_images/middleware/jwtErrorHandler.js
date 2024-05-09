const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('express-jwt');

const jwtErrorHandler = (err, req, res, next) => {
    const STATE = { FAILED: "FAILED" }; 

    if (err) {
        switch (err.constructor) {
            case UnauthorizedError:
            case jwt.TokenExpiredError:
                console.error('JWT Error:', err.message);
                return res.status(401).json({
                    status: STATE.FAILED,
                    errors: {
                        name: 'UnauthorizedError',
                        message: 'Access token is invalid or expired'
                    }
                });
            case jwt.JsonWebTokenError:
                console.error('JWT Error:', err.message);
                return res.status(400).json({
                    status: STATE.FAILED,
                    errors: {
                        name: 'InvalidParameter',
                        message: 'Invalid token provided'
                    }
                });
            default:
                console.error('Unexpected Error:', err.message);
                console.trace();
                return res.status(500).json({
                    status: STATE.FAILED,
                    errors: {
                        name: 'InternalError',
                        message: 'Something went wrong. Please try again later.'
                    }
                });
        }
    }
    return next();
};

module.exports = jwtErrorHandler;
