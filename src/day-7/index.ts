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
  if (folders.length) {
    folders.map((x) => (copy[x] = dig(copy[x] as folder)));
  }
  const folderSize = Object.values(copy as fileFolder).reduce((a, b) => a + b);
  if (folderSize <= 100000) {
    sum += folderSize;
  }
  return folderSize;
};

let needed: number;

const updateArr: number[] = [];

const dig2 = (obj: folder): number => {
  const copy = { ...obj };
  const folders = Object.keys(obj).filter((x) => typeof obj[x] === "object");
  if (folders.length) {
    folders.map((x) => (copy[x] = dig2(copy[x] as folder)));
  }
  const folderSize = Object.values(copy as fileFolder).reduce((a, b) => a + b);
  if (folderSize >= needed) {
    updateArr.push(folderSize);
  }
  return folderSize;
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  arr.map((x) => genObj(x));
  needed = dig(obj) - 40000000;
  return sum;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  dig2(obj);
  return updateArr.sort((a, b) => a - b)[0];
};
