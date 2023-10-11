import { transform } from "stream-transform";

transform(
  [
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
  ],
  function (data) {
    return new Promise((resolve) => {
      setImmediate(function () {
        data.push(data.shift());
        resolve(data.join(",") + "\n");
      });
    });
  },
  {
    parallel: 20,
  }
).pipe(process.stdout);

// Output:
// b,c,d,a
// 2,3,4,1
