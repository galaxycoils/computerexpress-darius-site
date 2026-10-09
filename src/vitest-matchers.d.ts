/// <reference types="@testing-library/jest-dom/vitest" />
//
// Adds the jest-dom matchers (toBeInTheDocument, toHaveAttribute, ...) to
// Vitest's Assertion type. src/setupTests.js registers them at runtime; without
// this reference TypeScript does not know they exist, which is why
// `npx tsc --noEmit` reported five "Property does not exist on type
// Assertion" errors in CouncilPage.test.tsx.
//
// The reference is here rather than in tsconfig `compilerOptions.types` because
// setting `types` would switch off automatic @types inclusion for the rest of
// the project.
