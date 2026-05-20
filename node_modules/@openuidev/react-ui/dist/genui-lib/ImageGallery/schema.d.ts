import { z } from "zod/v4";
export declare const ImageGallerySchema: z.ZodObject<{
    images: z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map