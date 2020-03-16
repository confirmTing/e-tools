const path = require("path");
const fs = require("fs");
const md5File = require("md5-file");
const yargs = require("yargs");
const chalk = require("chalk");

const argv = yargs.alias("i", "input").alias("o", "output").argv;

let { input, output } = argv;
if (output == null) {
  output = input;
}

let fileList = [];

function getOutput(filePath) {
  const extName = path.extname(filePath);
  const baseName = path.basename(filePath, extName);
  const hash = md5File.sync(filePath).slice(0, 8);
  const outputPath = path.resolve(
    process.cwd(),
    output,
    `${baseName}-${hash}${extName}`
  );

  return outputPath;
}

try {
  const files = fs.readdirSync(input);
  files.forEach(file => {
    const filePath = path.resolve(process.cwd(), input, file);

    fileList.push({
      filePath,
      output: getOutput(filePath)
    });
  });
} catch (e) {}

try {
  fileList.push({
    filePath: input,
    output: getOutput(input)
  });
} catch (e) {}

fileList.forEach(({ filePath, output }) => {
  fs.writeFileSync(path.resolve(output), fs.readFileSync(filePath));
});

console.log(chalk.green("generate successful"));
