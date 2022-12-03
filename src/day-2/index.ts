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

const sum = (async () => {
  const data = await getData();
  return data
    .split("\n")
    .map((x) => output(x))
    .reduce((a, b) => a + b);
})();

const sum2 = (async () => {
  const data = await getData();
  return data
    .split("\n")
    .map((x) => output2(x))
    .reduce((a, b) => a + b);
})();

const output = (str: string): number => {
  if (str === "A X") return 4;
  if (str === "A Y") return 8;
  if (str === "A Z") return 3;
  if (str === "B X") return 1;
  if (str === "B Y") return 5;
  if (str === "B Z") return 9;
  if (str === "C X") return 7;
  if (str === "C Y") return 2;
  if (str === "C Z") return 6;
  return 0;
};

const output2 = (str: string): number => {
  if (str === "A X") return 3;
  if (str === "A Y") return 4;
  if (str === "A Z") return 8;
  if (str === "B X") return 1;
  if (str === "B Y") return 5;
  if (str === "B Z") return 9;
  if (str === "C X") return 2;
  if (str === "C Y") return 6;
  if (str === "C Z") return 7;
  return 0;
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const answer = await sum;
  return answer;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const answer = await sum2;
  return answer;
};
