#!/usr/bin/env bash

for script in ./lib/*.js; do
  echo "################## $script"
  node $script
done
