/**
 * Validates every file in /content against the schemas and reports
 * unresolved references. Run with `npm run content:check`.
 */
import { buildContentReport, getSite } from "../lib/content-core.ts";

try {
  getSite();
  const report = buildContentReport();
  console.log("Content OK");
  for (const [key, value] of Object.entries(report.counts)) {
    console.log(`  ${key.padEnd(14)} ${value}`);
  }
  if (report.warnings.length) {
    console.log(`\n${report.warnings.length} warning(s):`);
    for (const warning of report.warnings) console.log(`  - ${warning}`);
  }
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}
