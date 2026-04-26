// Ensure the user has one of the allowed roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role (${req.user ? req.user.role : 'None'}) is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { authorizeRoles };
