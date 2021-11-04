#!/usr/bin/env bash
set -e

version=`node -v`

if [[ $version =~ ^v12\.16\..* ]]; then
  node --experimental-modules lib/csv.js
  node --experimental-modules lib/parse.js
else # starting with Node.js 12.17.0
  node lib/parse.js
fi

# node --loader ts-node/esm lib/parse.ts
