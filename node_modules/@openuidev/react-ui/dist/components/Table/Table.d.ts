import React from "react";
type TableAlignment = "left" | "center" | "right";
declare const Table: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableElement> & {
    containerRef?: React.RefObject<HTMLDivElement>;
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
} & React.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement> & React.RefAttributes<HTMLTableRowElement>>;
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    icon?: React.ReactNode;
    align?: TableAlignment;
}
declare const TableHead: React.ForwardRefExoticComponent<TableHeadProps & React.RefAttributes<HTMLTableCellElement>>;
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    align?: TableAlignment;
}
declare const TableCell: React.ForwardRefExoticComponent<TableCellProps & React.RefAttributes<HTMLTableCellElement>>;
export interface ScrollableTableProps extends React.HTMLAttributes<HTMLTableElement> {
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
}
declare const ScrollableTable: React.ForwardRefExoticComponent<ScrollableTableProps & React.RefAttributes<HTMLTableElement>>;
export { ScrollableTable, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, };
//# sourceMappingURL=Table.d.ts.map