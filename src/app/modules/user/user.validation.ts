import z from "zod";
import { IsActive, Role } from "./user.interface";

const bangladeshMobilePhoneRegex = /^(?:\+880|00880|0)?1[3-9]\d{8}$/;
export const createUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be string",
      required_error: "Name is required",
    })
    .min(3, {
      message: "Name is too short. Name must be minimum 3 charecters",
    }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*()_+={}[\]:;"'<>,.?/`~-]/, {
      message: "Password must contain at least one special character.",
    }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === null || val === "") {
          return true;
        }
        // Use the comprehensive regex
        return bangladeshMobilePhoneRegex.test(val);
      },
      {
        message:
          "Invalid Bangladeshi phone number format. Examples: 01xxxxxxxxx, +8801xxxxxxxxx, 8801xxxxxxxxx",
      }
    ),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(500, { message: "Address cannot exceed 500 characters" })
    .optional(),
});
export const updateUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be string",
      required_error: "Name is required",
    })
    .min(3, {
      message: "Name is too short. Name must be minimum 3 charecters",
    })
    .optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*()_+={}[\]:;"'<>,.?/`~-]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === null || val === "") {
          return true;
        }
        // Use the comprehensive regex
        return bangladeshMobilePhoneRegex.test(val);
      },
      {
        message:
          "Invalid Bangladeshi phone number format. Examples: 01xxxxxxxxx, +8801xxxxxxxxx, 8801xxxxxxxxx",
      }
    ),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(500, { message: "Address cannot exceed 500 characters" })
    .optional(),

  isDeleted: z
    .boolean({
      invalid_type_error:
        "isDeleted must be true or false or boolean data type",
    })
    .optional(),

  isActive: z.enum(Object.values(IsActive) as [string]).optional(),

  isVerified: z
    .boolean({
      invalid_type_error:
        "isVerified must be true or false or boolean data type",
    })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),
});
