import { hasSubscribers } from "diagnostics_channel";
import fs from "fs/promises";
import path from "path";
import _ from "lodash";
import { DefaultDeserializer } from "v8";

/******************************/
/* Utils                      */
/******************************/
const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input.txt"), {
    encoding: "utf8",
  });
};

let sum = 0;

const data = (async () => {
  const data = await getData();
  const arr = data.split("\n").map((x) => x.split("").map((y) => parseInt(y)));
  return arr;
})();

// Check if visible
const checkUp = (arr: number[][], treeX: number, treeY: number): boolean => {
  for (let y = treeY - 1; y >= 0; y--) {
    if (arr[treeX][y] >= arr[treeX][treeY]) return false;
  }
  return true;
};

const checkDown = (
  arr: number[][],
  treeX: number,
  treeY: number,
  maxI: number
): boolean => {
  for (let y = treeY + 1; y <= maxI; y++) {
    if (arr[treeX][y] >= arr[treeX][treeY]) return false;
  }
  return true;
};

const checkLeft = (arr: number[][], treeX: number, treeY: number): boolean => {
  for (let x = treeX - 1; x >= 0; x--) {
    if (arr[x][treeY] >= arr[treeX][treeY]) return false;
  }
  return true;
};

const checkRight = (
  arr: number[][],
  treeX: number,
  treeY: number,
  maxI: number
): boolean => {
  for (let x = treeX + 1; x <= maxI; x++) {
    if (arr[x][treeY] >= arr[treeX][treeY]) return false;
  }
  return true;
};

const checkAll = (
  arr: number[][],
  treeX: number,
  treeY: number,
  limX: number,
  limY: number
) => {
  const r = checkRight(arr, treeX, treeY, limX);
  const l = checkLeft(arr, treeX, treeY);
  const u = checkUp(arr, treeX, treeY);
  const d = checkDown(arr, treeX, treeY, limY);
  const visible = r || l || u || d;
  return visible;
};

const checkUp1 = (arr: number[][], treeX: number, treeY: number): number => {
  let sum = 0;
  for (let y = treeY - 1; y >= 0; y--) {
    if (arr[y][treeX] >= arr[treeY][treeX]) return sum + 1;
    else sum += 1;
  }
  return sum;
};

const checkDown1 = (
  arr: number[][],
  treeX: number,
  treeY: number,
  maxI: number
): number => {
  let sum = 0;
  for (let y = treeY + 1; y <= maxI; y++) {
    if (arr[y][treeX] >= arr[treeY][treeX]) return sum + 1;
    else sum += 1;
  }
  return sum;
};

const checkLeft1 = (arr: number[][], treeX: number, treeY: number): number => {
  let sum = 0;
  for (let x = treeX - 1; x >= 0; x--) {
    if (arr[treeY][x] >= arr[treeY][treeX]) return sum + 1;
    else sum += 1;
  }
  return sum;
};

const checkRight1 = (
  arr: number[][],
  treeX: number,
  treeY: number,
  maxI: number
): number => {
  let sum = 0;
  for (let x = treeX + 1; x <= maxI; x++) {
    if (arr[treeY][x] >= arr[treeY][treeX]) return sum + 1;
    else sum += 1;
  }
  return sum;
};

const checkAll1 = (
  arr: number[][],
  treeX: number,
  treeY: number,
  limX: number,
  limY: number
) => {
  const r = checkRight1(arr, treeX, treeY, limX);
  const l = checkLeft1(arr, treeX, treeY);
  const u = checkUp1(arr, treeX, treeY);
  const d = checkDown1(arr, treeX, treeY, limY);
  const visible = u * d * l * r;
  return visible;
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  const w = arr[0].length;
  const h = arr.length;
  const limX = w - 1;
  const limY = h - 1;
  sum += 2 * w + 2 * h - 4;
  for (let i = 1; i < limX; i++) {
    for (let j = 1; j < limY; j++) {
      if (checkAll(arr, i, j, limX, limY)) {
        sum += 1;
      }
    }
  }
  return sum;
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  const w = arr[0].length;
  const h = arr.length;
  const limX = w - 1;
  const limY = h - 1;
  const newArr = arr.map((y, j) =>
    y.map((x, i) => checkAll1(arr, i, j, limX, limY))
  );
  return Math.max(...newArr.map((y) => Math.max(...y)));
};
