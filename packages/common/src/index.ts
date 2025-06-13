import z from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(5, 'Username must be at least 5 characters'),
    email: z.string().email('Invalid email format').trim(),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export const SigninUserSchema = z.object({
    email: z.string().min(1).email('Invalid email format').trim(),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export const CreateRoomSchema = z.object({
  slug: z.string().min(3,"Give a bigger name").max(20,"Give a shorter name")
});

export const CodeAnalysisRequestSchema = z.object({
  code: z.string()
    .min(1, 'Code is required')
    .max(10000, 'Code must be less than 10,000 characters')
    .refine(
      (code) => code.trim().length > 0,
      'Code cannot be empty or only whitespace'
    ),
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt must be less than 1,000 characters')
    .refine(
      (prompt) => prompt.trim().length > 0,
      'Prompt cannot be empty or only whitespace'
    )
});