import { z } from "zod/v4";
export declare const ColSchema: z.ZodObject<{
    label: z.ZodString;
    data: z.ZodAny;
    type: z.ZodOptional<z.ZodEnum<{
        string: "string";
        number: "number";
        action: "action";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map