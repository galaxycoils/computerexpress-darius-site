import { z } from "zod/v4";
export declare const SeparatorSchema: z.ZodObject<{
    orientation: z.ZodOptional<z.ZodEnum<{
        horizontal: "horizontal";
        vertical: "vertical";
    }>>;
    decorative: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map