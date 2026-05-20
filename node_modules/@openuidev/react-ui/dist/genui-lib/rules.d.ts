import { z } from "zod/v4";
/**
 * Structured validation rules for form field components.
 * Example: { required: true, email: true, minLength: 5, max: 100 }
 * Available keys: required, email, url, numeric, min (number), max (number), minLength (number), maxLength (number), pattern (regex string)
 */
export declare const rulesSchema: z.ZodOptional<z.ZodObject<{
    required: z.ZodOptional<z.ZodBoolean>;
    email: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodBoolean>;
    numeric: z.ZodOptional<z.ZodBoolean>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    minLength: z.ZodOptional<z.ZodNumber>;
    maxLength: z.ZodOptional<z.ZodNumber>;
    pattern: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type RulesSchema = z.infer<typeof rulesSchema>;
//# sourceMappingURL=rules.d.ts.map