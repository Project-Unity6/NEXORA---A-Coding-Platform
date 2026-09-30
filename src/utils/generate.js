let n = 100000;

let arr = new Array(n).fill(1);

arr[n - 2] = 999999937;
arr[n - 1] = 999999938;

let target = 1999999875;

let input =
`${n}\n${arr.join(" ")}\n${target}`;

const fs = require("fs");

fs.writeFileSync(
   "tle-input.txt",
   JSON.stringify(input)
);

console.log("done");