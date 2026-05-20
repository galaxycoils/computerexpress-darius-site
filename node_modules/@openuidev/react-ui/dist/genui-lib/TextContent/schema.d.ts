import { z } from "zod/v4";
export declare const TextContentSchema: z.ZodObject<{
    text: z.ZodString;
    size: z.ZodOptional<z.ZodEnum<{
        small: "small";
        large: "large";
        default: "default";
        "small-heavy": "small-heavy";
        "large-heavy": "large-heavy";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map