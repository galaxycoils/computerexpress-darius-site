Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_chunk = require("../../chunk-CKQMccvm.cjs");
let clsx = require("clsx");
clsx = require_chunk.__toESM(clsx);
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/components/TextContent/TextContent.tsx
const variants = {
	clear: "text-content-clear",
	card: "text-content-card",
	sunk: "text-content-sunk"
};
const TextContent = (props) => {
	const { children, variant = "sunk", className, style } = props;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: (0, clsx.default)("text-content", variants[variant], className),
		style,
		children
	});
};
//#endregion
exports.TextContent = TextContent;

//# sourceMappingURL=index.cjs.map