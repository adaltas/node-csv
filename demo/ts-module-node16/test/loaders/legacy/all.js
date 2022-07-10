
import * as coffee from './coffee.js'
import * as ts from 'ts-node/esm'

const coffeeRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;
const tsRegex = /\.ts$/;

export function resolve(specifier, context, defaultResolve) {
  if (coffeeRegex.test(specifier)) {
    return coffee.resolve.apply(this, arguments)
  }
  if (tsRegex.test(specifier)) {
    return ts.resolve.apply(this, arguments)
  }
  return ts.resolve.apply(this, arguments);
}

export function getFormat(url, context, defaultGetFormat) {
  if (coffeeRegex.test(url)) {
    return coffee.getFormat.apply(this, arguments)
  }
  if (tsRegex.test(url)) {
    return ts.getFormat.apply(this, arguments)
  }
  return ts.getFormat.apply(this, arguments);
}

export function transformSource(source, context, defaultTransformSource) {
  const { url } = context;
  if (coffeeRegex.test(url)) {
    return coffee.transformSource.apply(this, arguments)
  }
  if (tsRegex.test(url)) {
    return ts.transformSource.apply(this, arguments)
  }
  return ts.transformSource.apply(this, arguments);
}
