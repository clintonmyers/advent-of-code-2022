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
    .map((x: string) => x.split(" "))
    .map((x: string[]) => [x[1], x[3], x[5]] as [string, string, string])
    .map((x: [string, string, string]) => x.map((y) => parseInt(y)))
    .map((x) => x as [number, number, number]);
})();

const obj: Iobj = {
  1: ["T", "Z", "B"],
  2: ["N", "D", "T", "H", "V"],
  3: ["D", "M", "F", "B"],
  4: ["L", "Q", "V", "W", "G", "J", "T"],
  5: ["M", "Q", "F", "V", "P", "G", "D", "W"],
  6: ["S", "F", "H", "G", "Q", "Z", "V"],
  7: ["W", "C", "T", "L", "R", "N", "S", "Z"],
  8: ["M", "R", "N", "J", "D", "W", "H", "Z"],
  9: ["S", "D", "F", "L", "Q", "M"],
};

interface Iobj {
  [key: number]: string[];
}

const move = (obj: Iobj, from: number, to: number): Iobj => {
  const newObj = { ...obj };
  const [box, ...newFrom] = [...obj[from]];
  newObj[from] = newFrom;
  newObj[to] = [box, ...obj[to]];
  return newObj;
};

const moveMultiple = (
  obj: Iobj,
  qty: number,
  from: number,
  to: number
): Iobj => {
  let copy = { ...obj };
  for (let i = 0; i < qty; i++) {
    copy = move({ ...copy }, from, to);
  }
  return copy;
};

const move2 = (obj: Iobj, qty: number, from: number, to: number): Iobj => {
  const newObj = { ...obj };
  let boxes: string[] = [];
  let finalFrom = [...obj[from]];
  for (let i = 0; i < qty; i++) {
    boxes.push(finalFrom.shift() as string);
  }
  newObj[from] = finalFrom;
  newObj[to] = [...boxes, ...obj[to]];
  return newObj;
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  let copy = { ...obj };
  (await data).map((x) => (copy = moveMultiple({ ...copy }, ...x)));
  return Object.values(copy)
    .map((x) => x[0])
    .join("");
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  let copy = { ...obj };
  (await data).map((x) => (copy = move2({ ...copy }, ...x)));
  return Object.values(copy)
    .map((x) => x[0])
    .join("");
};
