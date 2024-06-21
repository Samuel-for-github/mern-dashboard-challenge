import * as z from 'zod';
export const signUpValidation = z.object({
    fullName: z.string().min(2, {message:"Too short"}),
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {message:"Password must be at least 8 characters.",}),
    email: z.string().email()
})
export const signInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message:"Password must be at least 8 characters.",}),
})