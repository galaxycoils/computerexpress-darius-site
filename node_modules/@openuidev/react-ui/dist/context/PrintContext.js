import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from "react";
export const PrintContext = createContext(null);
export const usePrintContext = () => {
    const context = useContext(PrintContext);
    return context;
};
export const PrintContextProvider = ({ children }) => {
    const memoizedValue = useMemo(() => ({}), []);
    return _jsx(PrintContext.Provider, { value: memoizedValue, children: children });
};
//# sourceMappingURL=PrintContext.js.map