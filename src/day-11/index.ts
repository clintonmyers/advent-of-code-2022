import fs from "fs/promises";
import path from "path";
import Big from "big.js";

/******************************/
/* Utils                      */
/******************************/
const getData = async () => {
  return await fs.readFile(path.resolve(__dirname, "./input.txt"), {
    encoding: "utf8",
  });
};

type opVal = "old" | Big;
type opMeth = "+" | "*";
type opArr = [opVal, opMeth, opVal];

interface Monkey {
  items: Big[];
  op: opArr;
  div: number;
  divTrue: number;
  divFalse: number;
  inspections: number;
}

interface Monkeys {
  [key: number]: Monkey;
}

const monkeys: Monkeys = {};
let bigMod = 1;

const data = (async () => {
  const data = await getData();
  data
    .split("\n\n")
    .map((x) => x.split("\n"))
    .map((x, i) => {
      monkeys[i] = {} as Monkey;
      monkeys[i].items = x[1]
        .split(" ")
        .splice(4)
        .map((y) => Big(parseInt(y)));
      monkeys[i].op = formatOp(x[2]);
      monkeys[i].div = lastNum(x[3]);
      monkeys[i].divTrue = lastNum(x[4]);
      monkeys[i].divFalse = lastNum(x[5]);
      monkeys[i].inspections = 0;
      bigMod *= monkeys[i].div;
    });
  return monkeys;
})();

const formatOp = (input: string): opArr => {
  const last3 = input.split(" ").slice(5);
  const parsed = last3.map((x, i) => {
    if (i !== 1) {
      return x === "old" ? "old" : Big(parseInt(x));
    }
    return x;
  });
  return parsed as opArr;
};

// Returns last item of a split string as a number
const lastNum = (str: string): number => parseInt(str.split(" ").slice(-1)[0]);

// Perform x amount of rounds
const rounds = (qty: number) => {
  for (let i = 0; i < qty; i++) {
    round();
  }
};

// Each monkey empties their items by throwing
const round = () => Object.keys(monkeys).map((x, i) => throwItems(i));

// Throw all items a single monkey holds in order
const throwItems = (id: number) => {
  const arr = [...monkeys[id].items];
  arr.map((x) => throwItem(id));
};

const throwItem = (id: number) => {
  // Isolate item
  let item = monkeys[id].items.shift() as Big;
  // Inspect item
  item = inspectItem(item, monkeys[id].op);
  monkeys[id].inspections += 1;

  // DIVIDE BY 3 IS PART 1 ONLY !!!!!!!!!!!!!!
  // item = Math.floor(item / 3);

  // Throw item
  item.mod(monkeys[id].div).eq(0)
    ? throwTo(monkeys[id].divTrue, item)
    : throwTo(monkeys[id].divFalse, item);
};

const inspectItem = (item: Big, op: opArr): Big => {
  const replaceOld = (input: opVal): Big => (input === "old" ? item : input);
  const val1 = replaceOld(op[0]);
  const val2 = replaceOld(op[2]);
  const operator = op[1];
  if (operator === "+") return val1.add(val2);
  if (operator === "*") return val1.times(val2);
  console.log("help!");
  return Big(0);
};

const throwTo = (id: number, item: Big) => {
  monkeys[id].items.push(item.mod(bigMod));
};

/******************************/
/* Part One                   */
/******************************/
export const partOne = async () => {
  const obj = await data;
  // rounds(20);
  // const inspValue: number = Object.values(monkeys)
  //   .map((x) => x.inspections)
  //   .sort((a, b) => a - b)
  //   .splice(-2)
  //   .reduce((a, b) => a * b);
  // return inspValue;
  return "Uncomment code above and comment code below";
};

/******************************/
/* Part Two                   */
/******************************/
export const partTwo = async () => {
  const obj = await data;
  rounds(10000);
  const inspValue: number = Object.values(monkeys)
    .map((x) => x.inspections)
    .sort((a, b) => a - b)
    .splice(-2)
    .reduce((a, b) => a * b);
  return inspValue;
};
