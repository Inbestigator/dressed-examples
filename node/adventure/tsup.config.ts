import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["bot.gen.ts"],
    clean: true,
    minify: true,
    target: "es2022",
    format: "esm",
    treeshake: true,
});
