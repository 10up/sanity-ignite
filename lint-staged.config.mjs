// Returning a function (`() => ...`) tells lint-staged NOT to append the list
// of staged filenames to the command. We want the full-project npm scripts to
// run as-is: `tsc --noEmit` needs tsconfig (breaks if given file paths) and
// `biome lint .` already targets the whole project.
export default {
  '*.{ts,tsx,js,jsx}': () => ['npm run lint', 'npm run typecheck'],
};
