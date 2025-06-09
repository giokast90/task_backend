import {Request, Response, NextFunction} from "express";
import {auth} from "../../config/firebase";

// eslint-disable-next-line max-len,require-jsdoc
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401);

  try {
    const decoded = await auth.verifyIdToken(token);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user = {uid: decoded.uid};
    return next();
  } catch (err) {
    return res.status(403).json({message: "Invalid token"});
  }
}
