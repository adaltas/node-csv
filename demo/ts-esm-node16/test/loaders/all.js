import * as coffee from "./coffee.js";
import * as ts from "ts-node/esm";

const coffeeRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;
const tsRegex = /\.ts$/;

export function load(url, context, next) {
  if (coffeeRegex.test(url)) {
    return coffee.load.apply(this, arguments);
  }
  if (tsRegex.test(url)) {
    return ts.load.apply(this, arguments);
  }
  return next(url, context, next);
}
