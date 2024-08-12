import jwt from "jsonwebtoken";
export default function authenticateToken(req, res, next) {
  // Get token from cookies
  const token = req.cookies["token"];

  // Check if token is not available
  if (!token) return res.sendStatus(401); // Unauthorized

  // Verify token
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden

    // Attach user info to request object
    req.user = user;

    // Call the next middleware function or route handler
    next();
  });
}
