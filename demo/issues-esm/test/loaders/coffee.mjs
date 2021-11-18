// coffeescript-loader.mjs
import { URL, pathToFileURL } from 'url';
import CoffeeScript from 'coffeescript';
import { cwd } from 'process';

const baseURL = pathToFileURL(`${cwd()}/`).href;

// CoffeeScript files end in .coffee, .litcoffee or .coffee.md.
const extensionsRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;

export function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context;
  // Node.js normally errors on unknown file extensions, so return a URL for
  // specifiers ending in the CoffeeScript file extensions.
  if (extensionsRegex.test(specifier)) {
    return {
      url: new URL(specifier, parentURL).href
    };
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (extensionsRegex.test(url)) {
    const format = 'module'
    const { source: rawSource } = await defaultLoad(url, { format });
    return {
      format: 'module',
      source: CoffeeScript.compile(rawSource.toString(), {
        bare: true,
        filename: url,
      })
    };
  }
  return defaultLoad(url, context, defaultLoad);
}
