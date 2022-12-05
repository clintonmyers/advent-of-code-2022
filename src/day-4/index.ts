import { hasSubscribers } from "diagnostics_channel";
import fs from "fs/promises";
import path from "path";

/******************************/
/* Utils                      */
/******************************/
const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input.txt"), {
    encoding: "utf8",
  });
};

const data = (async () => {
  const data = await getData();
  return data
    .split("\n")
    .map((x) => x.split("-"))
    .map((x) => [x[0], ...x[1].split(","), x[2]])
    .map((x) => x.map((y) => parseInt(y)));
})();

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  let sum = 0;
  arr.map((x) => {
    if ((x[0] <= x[2] && x[1] >= x[3]) || (x[2] <= x[0] && x[3] >= x[1])) {
      sum += 1;
    }
  });
  return sum;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  let sum = 0;
  arr.map((x) => {
    if ((x[1] >= x[2] && x[0] <= x[2]) || (x[3] >= x[0] && x[2] <= x[0])) {
      sum += 1;
    }
  });
  return sum;
};
