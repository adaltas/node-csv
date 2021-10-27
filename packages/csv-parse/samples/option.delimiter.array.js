
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const input = `color name::red::green::blue
Cyan \t     "0"   :: 255   :: 255
Yellow \t   "255" :: "255" ::"0"
Hot Pink \t "255" :: 105   :: "180"`;

const output = parse(input, {
  delimiter: ["::","\t"],
  trim: true,
  columns: true,
}).map((rec) => {
  let indent = "";
  return Object.entries(rec).map(([key, value]) => {
    const row = `${indent}${key}: <${value}>`;
    indent = (indent.length === 0 ? "    " : indent);
    return row;
  }).join('\n');
}).join('\n');

assert.equal(output, `
color name: <Cyan>
    red: <0>
    green: <255>
    blue: <255>
color name: <Yellow>
    red: <255>
    green: <255>
    blue: <0>
color name: <Hot Pink>
    red: <255>
    green: <105>
    blue: <180>
`.trim());
