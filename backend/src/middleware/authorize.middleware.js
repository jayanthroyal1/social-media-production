const AppError = require("../utils/AppError");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return new AppError("Access denied. Insufficent permission", 403);
    }
    next();
  };
};

module.exports = authorize;
