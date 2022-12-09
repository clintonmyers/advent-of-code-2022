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
    .map((x) => obj[findDupe(splitInHalf(x))])
    .reduce((a, b) => a + b);
})();

const splitInHalf = (str: string): [string, string] => {
  const len = str.length;
  const mid = len / 2;
  return [str.slice(0, mid), str.slice(mid, len)];
};

const findDupe = (arr: [string, string]): string => {
  let x: string = "";
  arr[0].split("").map((char) => {
    if (arr[1].split("").indexOf(char) > -1) {
      x = char;
    }
  });
  return x;
};

const sum2 = (async () => {
  const data = await getData();
  return (
    data
      .split("\n")
      // Borrowed from stack overflow. Create groupings of 3.
      .reduce(
        (r: any, e, i) => (i % 3 ? r[r.length - 1].push(e) : r.push([e])) && r,
        []
      )
      .map((x: string[]) => obj[findDupe2(x)])
      .reduce((a: number, b: number) => a + b)
  );
})();

const findDupe2 = (arr: string[]): string => {
  let x: string = "";
  arr[0].split("").map((char) => {
    if (
      arr[1].split("").indexOf(char) > -1 &&
      arr[2].split("").indexOf(char) > -1
    ) {
      x = char;
    }
  });
  return x;
};

// Object that holds letters as keys and numbers as values
// a: 1, b: 2, etc...
const obj: { [key: string]: number } = {};
// Generates character codes for uppercase letters.
// Borrowed from a medium article
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const upperArr = alpha.map((x) => String.fromCharCode(x));
const lowerArr = upperArr.map((x) => x.toLowerCase());
// Flesh out the object with entries
[...lowerArr, ...upperArr].map((x, i) => (obj[x] = i + 1));

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
