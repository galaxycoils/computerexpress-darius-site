import { z } from "zod/v4";
export const chart1DDataSchema = z.array(z.object({
    category: z.string(),
    value: z.number(),
}));
export const chart2DDataSchema = z.object({
    labels: z.array(z.string()),
    series: z
        .array(z.object({
        category: z.string(),
        values: z.array(z.number()),
    }))
        .default([]),
});
export const scatterDataSchema = z.array(z.object({
    name: z.string(),
    series: z.array(z.object({
        x: z.number(),
        y: z.number(),
        z: z.number().optional(),
    })),
}));
export const miniChartDataSchema = z.array(z.number());
export function transform2DData(data) {
    return data.labels.map((label, i) => {
        const row = { category: label };
        for (const s of data.series) {
            row[s.category] = s.values[i] ?? 0;
        }
        return row;
    });
}
export function transform1DData(data) {
    return data;
}
export function transformScatterData(data) {
    return data.map((dataset) => ({
        name: dataset.name,
        data: dataset.series,
    }));
}
//# sourceMappingURL=dataSchemas.js.map