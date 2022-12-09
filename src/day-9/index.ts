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
  return data.split("\n");
})();

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  return 1;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  return 1;
};
