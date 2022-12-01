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

/******************************/
/* Part One - Start 1:20CST   */
/******************************/
export const partOne = async () => {
  const data = await getData();
  const arr: number[] = data
    .split("\n\n")
    .map((x) => x.split("\n"))
    .map((y) => y.map((z) => parseInt(z)).reduce((a, b) => a + b));
  const max = Math.max(...arr);
  return max;
};

/*******************************/
/* Part Two - Fin 1:46CST      */
/*******************************/
export const partTwo = async () => {
  const data = await getData();
  const arr: number[] = data
    .split("\n\n")
    .map((x) => x.split("\n"))
    .map((y) => y.map((z) => parseInt(z)).reduce((a, b) => a + b));
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    const max = Math.max(...arr);
    const maxIndex = arr.indexOf(max);
    arr.splice(maxIndex, 1);
    sum += max;
  }
  return sum;
};
