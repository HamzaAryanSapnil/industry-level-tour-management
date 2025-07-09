import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
  PORT: string;
  MONGODB_URI:string;
  NODE_ENV: "development" | "production" ;
}

const loadEnvVariables = (): EnvConfig => {

  const requiredEnvVariables: string[] = ['PORT', 'MONGODB_URI', 'NODE_ENV', ]
  requiredEnvVariables.forEach(variable => {
    if (!process.env[variable]) {
      throw new Error(`Missing env variable ${variable}`)
    }
  })

  return {
    PORT: process.env.PORT as string,
    MONGODB_URI: process.env.MONGODB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  }
}

export const envVars: EnvConfig = loadEnvVariables()