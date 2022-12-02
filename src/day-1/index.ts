import fs from "fs/promises";
import path from "path";

const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input.txt"), {
    encoding: "utf8",
  });
};

const arrOfSums = (async () => {
  const data = await getData();
  return data
    .split("\n\n")
    .map((x) => x.split("\n"))
    .map((y) => y.map((z) => parseInt(z)).reduce((a, b) => a + b))
    .sort();
})();

export const partOne = async () => {
  return (await arrOfSums).slice(-1);
};

export const partTwo = async () => {
  return (await arrOfSums).slice(-3).reduce((c, d) => c + d);
};
