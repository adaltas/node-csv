import CoffeeScript from "coffeescript";

// See https://github.com/nodejs/node/issues/36396
const extensionsRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;

export async function load(url, context, next) {
  if (extensionsRegex.test(url)) {
    const format = "module";
    const { source: rawSource } = await next(url, { format });
    const source = CoffeeScript.compile(rawSource.toString(), {
      bare: true,
      inlineMap: true,
      filename: url,
      header: false,
      sourceMap: false,
    });
    return { format, source };
  }
  return next(url, context);
}
