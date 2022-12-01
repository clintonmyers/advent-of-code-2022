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
  return Math.max(
    ...data
      .split("\n\n")
      .map((x) => x.split("\n"))
      .map((y) => y.map((z) => parseInt(z)).reduce((a, b) => a + b))
  );
};

/*******************************/
/* Part Two - Fin 1:46CST      */
/*******************************/
export const partTwo = async () => {
  const data = await getData();
  return data
    .split("\n\n")
    .map((x) => x.split("\n"))
    .map((y) => y.map((z) => parseInt(z)).reduce((a, b) => a + b))
    .sort()
    .slice(-3)
    .reduce((c, d) => c + d);
};
