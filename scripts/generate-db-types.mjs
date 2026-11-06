import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const result = spawnSync(
  "pnpm",
  ["exec", "supabase", "gen", "types", "typescript", "--local"],
  {
    encoding: "utf8",
    shell: true,
  },
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

writeFileSync("src/types/database.ts", `${result.stdout.trimEnd()}\n`, "utf8");
console.log("Wrote src/types/database.ts");
