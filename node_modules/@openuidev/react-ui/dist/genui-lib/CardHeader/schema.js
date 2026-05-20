import { z } from "zod/v4";
export const CardHeaderSchema = z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
});
//# sourceMappingURL=schema.js.map