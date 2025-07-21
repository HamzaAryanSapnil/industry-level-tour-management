import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import AppError from "../Error-Helpers/App-Error";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exists");
      }

      if (
        isUserExists.isActive === IsActive.BLOCKED ||
        isUserExists.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExists.isActive}`
        );
      }

      if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      // const {email, userId, role} = verifiedToken

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You don't have permission to access this route"
        );
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
