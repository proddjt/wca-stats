import * as z from "zod"; 
 
export const pwdSchema = z
    .string()
    .min(8, {
        error: 'lunghezza'
    })
    .refine((password) => /[A-Z]/.test(password), {
        error: "maiuscola",
    })
    .refine((password) => /[a-z]/.test(password), {
        error: "minuscola",
    })
    .refine((password) => /[0-9]/.test(password), {
        error: "numero"
    })
    .refine((password) => /[!@#$%^&.*]/.test(password), {
        error: "speciale",
    })