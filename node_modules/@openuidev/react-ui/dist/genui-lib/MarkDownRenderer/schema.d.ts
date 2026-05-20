import { z } from "zod/v4";
export declare const MarkDownRendererSchema: z.ZodObject<{
    textMarkdown: z.ZodString;
    variant: z.ZodOptional<z.ZodEnum<{
        clear: "clear";
        card: "card";
        sunk: "sunk";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map