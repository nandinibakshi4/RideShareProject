import jwt from "jsonwebtoken"
import { createError } from "./error.js";




export const verifyToken = (req, res, next) => {
  let token = req.cookies.accessToken;

  // Also check Authorization header
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ error: "You are not authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token is not valid!" });
    req.user = user;
    next();
  });
};


export const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
