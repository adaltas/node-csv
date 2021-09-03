
import stringify from '../lib/sync.js'

const r = v => (v / 1024 / 1024).toFixed(2);
const printMemoryUsage = () => {
  const { rss, heapTotal, heapUsed } = process.memoryUsage();
  console.log(`Memory usage: rss ${r(rss)}, heap ${r(heapUsed)} / ${r(heapTotal)}`);
};

const record = []; for (let i = 0; i < 100; i += 1) { record.push(`field-${i}`); }
const records = []; for (let i = 0; i < 100000; i += 1) { records.push([...record]); }

console.log(': records created');
printMemoryUsage();

for (let i = 1; i < 100; i += 1) {
  stringify(records);
  console.log(': after stringify # %s', i);
  printMemoryUsage();
}
