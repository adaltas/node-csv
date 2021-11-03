#!/usr/bin/env bash
set -e

node --loader ts-node/esm lib/parse.ts
