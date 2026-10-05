const NON_DATA_BLOCK_TYPES = new Set([
  "module",
  "importmap",
  "speculationrules",
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript",
]);

/**
 * Mirrors React's rule for `<script>` elements created on the client: only data blocks
 * (a non-empty `type` the browser won't run) are accepted without the "Encountered a script tag" error.
 */
export function isScriptDataBlock(type: string | null | undefined): boolean {
  if (!type) return false;
  return !NON_DATA_BLOCK_TYPES.has(type.toLowerCase());
}
