import { useMemo } from "react";
import { usePrintContext } from "../../../context/PrintContext";
export const useExportChartData = ({ type, data, categoryKey, dataKeys, colors, legend, xAxisLabel, yAxisLabel, extraOptions, customDataTransform, }) => {
    const printContext = usePrintContext();
    return useMemo(() => {
        if (!printContext) {
            return undefined;
        }
        const chartData = customDataTransform
            ? customDataTransform()
            : (dataKeys || []).map((key) => ({
                name: key,
                labels: data.map((item) => (categoryKey ? String(item[categoryKey]) : "")),
                values: data.map((item) => Number(item[key])),
            }));
        const exportData = {
            type,
            data: chartData,
            options: {
                chartColors: colors,
                showLegend: legend,
                catAxisTitle: typeof xAxisLabel === "string" ? xAxisLabel : undefined,
                showCatAxisTitle: typeof xAxisLabel === "string",
                valAxisTitle: typeof yAxisLabel === "string" ? yAxisLabel : undefined,
                showValAxisTitle: typeof yAxisLabel === "string",
                ...extraOptions,
            },
        };
        return JSON.stringify(exportData);
    }, [
        type,
        data,
        dataKeys,
        categoryKey,
        colors,
        legend,
        xAxisLabel,
        yAxisLabel,
        extraOptions,
        customDataTransform,
        printContext,
    ]);
};
//# sourceMappingURL=useExportChartData.js.map