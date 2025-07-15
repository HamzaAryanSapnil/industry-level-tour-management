import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGODB_URI: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  BCRYPT_SALT_ROUND: string;
  SUPER_ADMIN_EMAIL: string
  SUPER_ADMIN_PASSWORD: string
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "MONGODB_URI",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "BCRYPT_SALT_ROUND",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing env variable ${variable}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    MONGODB_URI: process.env.MONGODB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
  };
};

export const envVars: EnvConfig = loadEnvVariables();
