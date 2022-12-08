import { hasSubscribers } from "diagnostics_channel";
import fs from "fs/promises";
import path from "path";
import _ from "lodash";

/******************************/
/* Utils                      */
/******************************/
const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input.txt"), {
    encoding: "utf8",
  });
};

let pathArr: string[] = [];

const obj: folder = {};

let sum = 0;

interface file {
  [name: string]: number;
}

interface folder {
  [name: string]: folder | number;
}

interface fileFolder {
  [name: string]: number;
}

const data = (async () => {
  const data = await getData();
  return data.split("\n");
})();

const setProp = (name: string, value: {} | number = {}): void => {
  _.set(obj, [...pathArr, name], value);
};

const genObj = (str: string): void => {
  const arr = str.split(" ");
  switch (arr[0]) {
    case "$":
      switch (arr[1]) {
        case "cd":
          switch (arr[2]) {
            case "..":
              pathArr.pop();
              break;
            default:
              pathArr.push(arr[2]);
              break;
          }
          break;
        case "ls":
          break;
      }
      break;
    case "dir":
      setProp(arr[1], {});
      break;
    default:
      setProp(arr[1], parseInt(arr[0]));
      break;
  }
};

const dig = (obj: folder): number => {
  const copy = { ...obj };
  const folders = Object.keys(obj).filter((x) => typeof obj[x] === "object");
  // console.log(folders);
  if (folders.length) {
    folders.map((x) => (copy[x] = dig(copy[x] as folder)));
  }
  const folderSize = Object.values(copy as fileFolder).reduce((a, b) => a + b);
  if (folderSize <= 100000) {
    // console.log(Object.values(copy));
    sum += folderSize;
  }
  return folderSize;
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  arr.map((x) => genObj(x));
  console.log(obj);
  dig(obj);
  return sum;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  return 1;
};
