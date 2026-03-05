// why schema ---> Because each route has different validation rules.
// Example:
// register → email + password
// createPost → content
// updatePost → optional content

// Why property = "body"?
// Because sometimes we validate:
// req.body
// req.query
// req.params
// So this middleware supports all three.
// Flexible design > rigid design.

const validation = (schema, property = "body") => {
  return (req, res, next) => {
    // why req[property] --> We validate:
    // request body
    // or query
    // or params
    // Based on property
    const { error, value } = schema.validate(req[property], {
      // aboutEarly --> default Joi behavior which will stops at first error
      abortEarly: false,
      // stripUnknow will remove which is apart form schema
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        // Joi will returns detailed error objects
        errors: error?.details?.map((err) => err.message),
      });
    }
    //--------🔹req[property] = value ------------
    // Why assign value back?
    // Because Joi may:
    // Trim strings
    // Convert types
    // Remove unknown fields
    // We want controller to use sanitized data.
    req[property] = value;
    next();
  };
};

module.exports = validation;
