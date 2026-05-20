import { ExportChartData } from "../Charts";
export interface UseExportChartDataProps {
    type: ExportChartData["type"];
    data: any[];
    categoryKey?: string;
    dataKeys?: string[];
    colors: string[];
    legend?: boolean;
    xAxisLabel?: React.ReactNode;
    yAxisLabel?: React.ReactNode;
    extraOptions?: Omit<NonNullable<ExportChartData["options"]>, "chartColors" | "showLegend" | "catAxisTitle" | "valAxisTitle">;
    customDataTransform?: () => ExportChartData["data"];
}
export declare const useExportChartData: ({ type, data, categoryKey, dataKeys, colors, legend, xAxisLabel, yAxisLabel, extraOptions, customDataTransform, }: UseExportChartDataProps) => string | undefined;
//# sourceMappingURL=useExportChartData.d.ts.map