export function hasAllProps(obj, ...keys) {
    return keys.every((k) => obj[k] != null);
}
export function asArray(v) {
    if (Array.isArray(v))
        return v;
    if (v == null)
        return [];
    return [v];
}
function asElementNodes(v) {
    return asArray(v).filter((x) => typeof x === "object" && x !== null && x["type"] === "element");
}
export function buildChartData(labels, series) {
    const lbls = asArray(labels);
    // Tabular format: labels = column names, series = 2D rows from Query results
    // e.g. AreaChart(data.columns, data.results) where columns=["day","views","users"]
    // and results=[["Mon",100,50],["Tue",200,75]]
    const rows = asArray(series);
    if (rows.length > 0 && Array.isArray(rows[0])) {
        // Column 0 = category labels, columns 1+ = series values
        const seriesNames = lbls.slice(1);
        return rows.map((row) => {
            const cells = row;
            const point = { category: String(cells[0] ?? "") };
            seriesNames.forEach((name, si) => {
                const val = cells[si + 1];
                point[name] = typeof val === "number" ? val : Number(val) || 0;
            });
            return point;
        });
    }
    // Original format: labels = x-axis values, series = Series() elements
    const seriesNodes = asElementNodes(series);
    return lbls.map((label, i) => {
        const point = { category: label };
        seriesNodes.forEach((s) => {
            const cat = s.props["category"];
            const vals = s.props["values"];
            if (typeof cat === "string" && Array.isArray(vals) && i < vals.length) {
                point[cat] = vals[i];
            }
        });
        return point;
    });
}
export function buildSliceData(slices) {
    return asElementNodes(slices).map((s) => ({
        category: s.props["category"],
        value: s.props["value"],
    }));
}
//# sourceMappingURL=helpers.js.map