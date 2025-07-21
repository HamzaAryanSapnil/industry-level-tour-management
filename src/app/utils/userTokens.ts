import httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../Error-Helpers/App-Error";

export const createUserTokens =  (user: Partial<IUser>) => {
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    userId: user?._id,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};


export const createNewAccessTokenWithNewRefreshToken = async (refreshToken: string) => {
   const verifiedRefreshToken = verifyToken(
     refreshToken,
     envVars.JWT_REFRESH_SECRET
   ) as JwtPayload;

   const isUserExists = await User.findOne({
     email: verifiedRefreshToken.email,
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

   const jwtPayload = {
     email: isUserExists?.email,
     role: isUserExists?.role,
     userId: isUserExists?._id,
   };

   const accessToken = generateToken(
     jwtPayload,
     envVars.JWT_ACCESS_SECRET,
     envVars.JWT_ACCESS_EXPIRES
   );

   return accessToken
}