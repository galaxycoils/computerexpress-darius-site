import { z } from "zod/v4";
export declare const chart1DDataSchema: z.ZodArray<z.ZodObject<{
    category: z.ZodString;
    value: z.ZodNumber;
}, z.core.$strip>>;
export declare const chart2DDataSchema: z.ZodObject<{
    labels: z.ZodArray<z.ZodString>;
    series: z.ZodDefault<z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        values: z.ZodArray<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const scatterDataSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    series: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>>;
export declare const miniChartDataSchema: z.ZodArray<z.ZodNumber>;
export type Chart1DData = z.infer<typeof chart1DDataSchema>;
export type Chart2DData = z.infer<typeof chart2DDataSchema>;
export type ScatterData = z.infer<typeof scatterDataSchema>;
export type MiniChartData = z.infer<typeof miniChartDataSchema>;
export declare function transform2DData(data: Chart2DData): Array<Record<string, string | number>>;
export declare function transform1DData(data: Chart1DData): Array<Record<string, string | number>>;
export declare function transformScatterData(data: ScatterData): Array<{
    name: string;
    data: Array<{
        x: number;
        y: number;
        z?: number;
    }>;
}>;
//# sourceMappingURL=dataSchemas.d.ts.map