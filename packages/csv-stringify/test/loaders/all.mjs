
import * as coffee from './coffee.mjs'
import * as ts from 'ts-node/esm'

const coffeeRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;
const tsRegex = /\.ts$/;

export async function resolve(specifier, context, defaultResolve) {
  if (coffeeRegex.test(specifier)) {
    return coffee.resolve.apply(this, arguments)
  }
  if (tsRegex.test(specifier)) {
    return ts.resolve.apply(this, arguments)
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export function load(url, context, defaultLoad) {
  if (coffeeRegex.test(url)) {
    return coffee.load.apply(this, arguments)
  }
  if (tsRegex.test(url)) {
    return ts.load.apply(this, arguments)
  }
  return defaultLoad(url, context, defaultLoad);
}
