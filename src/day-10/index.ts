import { count } from "console";
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
    .map((x: string) => (x === "noop" ? 0 : parseInt(x.split(" ")[1])));
})();

const powerSum = (data: number[], cycles: number[]): number => {
  let counter = 1;
  const register: { [key: number]: number } = { 1: 1 };
  const power: { [key: number]: number } = { 1: 1 };

  data.map((x) => {
    counter += 1;
    register[counter] = register[counter - 1];
    power[counter] = register[counter] * counter;
    if (x !== 0) {
      counter += 1;
      register[counter] = register[counter - 1] + x;
      power[counter] = register[counter] * counter;
    }
  });

  return cycles.map((x) => power[x]).reduce((a, b) => a + b);
};

const render = (data: number[]) => {
  let counter = 1;
  const register: { [key: number]: number } = { 1: 1 };

  data.map((x) => {
    counter += 1;
    register[counter] = register[counter - 1];
    if (x !== 0) {
      counter += 1;
      register[counter] = register[counter - 1] + x;
    }
  });

  let line = -1;
  const lines: string[][] = [];

  Object.values(register).map((x, i) => {
    if (i % 40 === 0) {
      line += 1;
      lines.push([]);
    }
    lines[line].push(renderPixel(x, i));
  });

  lines.map((x) => console.log(x.join("")));
};

const renderPixel = (register: number, index: number): string => {
  let adjIndex = index;
  while (adjIndex >= 40) {
    adjIndex -= 40;
  }
  return Math.abs(adjIndex - register) <= 1 ? "#" : ".";
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const arr = await data;
  return powerSum(arr, [20, 60, 100, 140, 180, 220]);
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const arr = await data;
  render(arr);
  return "See Above";
};
