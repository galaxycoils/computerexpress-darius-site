import { z } from "zod/v4";
export declare const TextCalloutSchema: z.ZodObject<{
    variant: z.ZodOptional<z.ZodEnum<{
        neutral: "neutral";
        info: "info";
        danger: "danger";
        warning: "warning";
        success: "success";
    }>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map