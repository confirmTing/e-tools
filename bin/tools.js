#!/usr/bin/env node

const argv = require("yargs").argv;
const crossSpawn = require("cross-spawn");
const args = process.argv.slice(2);
const scriptIndex = args.findIndex(x => x === "file");

const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (!["md5"].includes(script)) {
  return console.log(`Unknown script "${script}"`);
}

crossSpawn.sync(
  "node",
  nodeArgs
    .concat(require.resolve("../src/tools/" + script))
    .concat(args.slice(scriptIndex + 1)),
  { stdio: "inherit" }
);
