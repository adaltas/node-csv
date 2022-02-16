import CoffeeScript from 'coffeescript';

const coffeeRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;

export async function load(url, context, next) {
  if (coffeeRegex.test(url)) {
    const format = 'module';
    const { source: rawSource } = await next(url, { format });
    const source = CoffeeScript.compile(rawSource.toString(), { bare: true });
    return {format, source};
  }
  return next(url, context);
}
