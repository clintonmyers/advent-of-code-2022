async function main() {
  if (process.argv[2]) {
    const day = process.argv[2];
    executeDay(day);
  } else {
    for (let i = 0; i < 25; i++) {
      if (i > 0) {
        console.log();
      }

      const day = (i + 1).toString();
      try {
        await executeDay(day);
      } catch {
        break;
      }
    }
  }
}

async function executeDay(day: string) {
  const { partOne, partTwo } = require(`./day-${day}`);
  const answerOne = await partOne();
  const answerTwo = await partTwo();

  console.info(`\n-------------------------------`);
  console.info(`| DAY - ${day}`);
  console.info(`-------------------------------`);
  console.info(`| Part 1: ${answerOne}`);
  console.info(`| Part 2: ${answerTwo}`);
  console.info(`-------------------------------`);
}

main();
