export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    for (const key of Object.keys(req.body)) {
      if (req.body[key] === "" || req.body[key] === undefined) {
        req.body[key] = null;
      }
    }
  }
  next();
};
