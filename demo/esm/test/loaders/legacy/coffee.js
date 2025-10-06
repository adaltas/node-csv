// coffeescript-loader.mjs
import { URL, pathToFileURL } from "url";
import CoffeeScript from "coffeescript";
import { cwd } from "process";

const baseURL = pathToFileURL(`${cwd()}/`).href;

// CoffeeScript files end in .coffee, .litcoffee or .coffee.md.
const extensionsRegex = /\.coffee$|\.litcoffee$|\.coffee\.md$/;

export function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context;
  // Node.js normally errors on unknown file extensions, so return a URL for
  // specifiers ending in the CoffeeScript file extensions.
  if (extensionsRegex.test(specifier)) {
    return {
      url: new URL(specifier, parentURL).href,
      stop: true,
    };
  }
  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export function getFormat(url, context, defaultGetFormat) {
  // Now that we patched resolve to let CoffeeScript URLs through, we need to
  // tell Node.js what format such URLs should be interpreted as. For the
  // purposes of this loader, all CoffeeScript URLs are ES modules.
  if (extensionsRegex.test(url)) {
    return {
      format: "module",
      stop: true,
    };
  }
  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat);
}

export function transformSource(source, context, defaultTransformSource) {
  const { url } = context;

  if (extensionsRegex.test(url)) {
    return {
      source: CoffeeScript.compile(String(source), { bare: true }),
    };
  }

  // Let Node.js handle all other sources.
  return defaultTransformSource(source, context, defaultTransformSource);
}
