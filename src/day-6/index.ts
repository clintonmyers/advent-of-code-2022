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
  return data.split("");
})();

const checkStart = (arr: string[]): number => {
  const answer: number[] = [];
  arr.map((x, i, arr) => {
    if (i < 3) return x;
    if (new Set([arr[i], arr[i - 1], arr[i - 2], arr[i - 3]]).size === 4) {
      answer.push(i + 1);
    }
  });
  return answer[0];
};

const check14 = (arr: string[]): number => {
  const answer: number[] = [];
  arr.map((x, i, arr) => {
    if (i < 13) return x;
    if (
      new Set([
        arr[i],
        arr[i - 1],
        arr[i - 2],
        arr[i - 3],
        arr[i - 4],
        arr[i - 5],
        arr[i - 6],
        arr[i - 7],
        arr[i - 8],
        arr[i - 9],
        arr[i - 10],
        arr[i - 11],
        arr[i - 12],
        arr[i - 13],
      ]).size === 14
    ) {
      answer.push(i + 1);
    }
  });
  return answer[0];
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  return checkStart(arr);
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  return check14(arr);
};
