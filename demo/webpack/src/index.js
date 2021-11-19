
import * as csv from 'csv/browser/esm/index.js';
import * as csvSync from 'csv/browser/esm/sync.js';
import {generate} from 'csv-generate/browser/esm/index.js';
import {generate as generateSync} from 'csv-generate/browser/esm/sync.js';
import {parse} from 'csv-parse/browser/esm/index.js';
import {parse as parseSync} from 'csv-parse/browser/esm/sync.js';
import {transform} from 'stream-transform/browser/esm/index.js';
import {transform as transformSync} from 'stream-transform/browser/esm/sync.js';
import {stringify} from 'csv-stringify/browser/esm/index.js';
import {stringify as stringifySync} from 'csv-stringify/browser/esm/sync.js';

function generateRecords(generate, callback) {
  generate({length: 2, objectMode: true}, (err, records) => {
    callback(err, records);
  });
}

function generateSyncRecords(generateSync, callback) {
  const records = generateSync({length: 2, objectMode: true});
  callback(null, records);
}

function parseRecors(parse, callback) {
  parse('a,b,c\n1,2,3', (err, records) => {
    callback(err, records);
  });
}

function parseSyncRecors(parseSync, callback) {
  const records = parseSync('a,b,c\n1,2,3');
  callback(null, records);
}

function transformRecors(transform, callback) {
  transform([
    ['a', 'b', 'c'],
    [1, 2, 3]
  ], (record) => {
    record.push(record.shift());
    return record;
  }, (err, records) => {
    callback(err, records);
  });
}

function transformSyncRecors(transformSync, callback) {
  const records = transformSync([
    ['a', 'b', 'c'],
    [1, 2, 3]
  ], (record) => {
    record.push(record.shift());
    return record;
  });
  callback(null, records);
}

function stringifyRecors(stringify, callback) {
  stringify([['a', 'b', 'c'], [1, 2, 3]], (err, data) => {
    callback(err, data);
  });
}

function stringifySyncRecors(handler, callback) {
  const data = handler([['a', 'b', 'c'], [1, 2, 3]]);
  callback(null, data);
}

function h1(title) {
  const element = document.createElement('h1');
  element.innerHTML = title;
  return element;
}

function h2(title) {
  const element = document.createElement('h2');
  element.innerHTML = title;
  return element;
}

function wrap(handler, fn) {
  const element = document.createElement('div');
  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = '...loading...';
  fn.call( null, handler, (err, records) => {
    element.innerHTML = `<pre><code>${JSON.stringify(records, null, 2)}</code></pre>`
  });
  return element;
}

document.body.appendChild(h1('Test for webpack and CommonJS with individual packages'));
document.body.appendChild(h2('Package `csv-generate`'));
document.body.appendChild(wrap(generate, generateRecords));
document.body.appendChild(wrap(generateSync, generateSyncRecords));
document.body.appendChild(h2('Package `csv-parse`'));
document.body.appendChild(wrap(parse, parseRecors));
document.body.appendChild(wrap(parseSync, parseSyncRecors));
document.body.appendChild(h2('Package `stream-transform`'));
document.body.appendChild(wrap(transform, transformRecors));
document.body.appendChild(wrap(transformSync, transformSyncRecors));
document.body.appendChild(h2('Package `csv-stringify`'));
document.body.appendChild(wrap(stringify, stringifyRecors));
document.body.appendChild(wrap(stringifySync, stringifySyncRecors));

document.body.appendChild(document.createElement('hr'));

document.body.appendChild(h1('Test for webpack and CommonJS with csv packages'));
document.body.appendChild(h2('Package `csv-generate`'));
document.body.appendChild(wrap(csv.generate, generateRecords));
document.body.appendChild(wrap(csvSync.generate, generateSyncRecords));
document.body.appendChild(h2('Package `csv-parse`'));
document.body.appendChild(wrap(csv.parse, parseRecors));
document.body.appendChild(wrap(csvSync.parse, parseSyncRecors));
document.body.appendChild(h2('Package `stream-transform`'));
document.body.appendChild(wrap(csv.transform, transformRecors));
document.body.appendChild(wrap(csvSync.transform, transformSyncRecors));
document.body.appendChild(h2('Package `csv-stringify`'));
document.body.appendChild(wrap(csv.stringify, stringifyRecors));
document.body.appendChild(wrap(csvSync.stringify, stringifySyncRecors));
