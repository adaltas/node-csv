import assert from "assert";
import { parse } from "csv-parse";
import { generate } from "csv-generate";

// Expected data
let headers = null;
const third_column = [];
// Fake readable stream
const parser = generate({
  high_water_mark: 64 * 64,
  length: 100,
  seed: 1,
}).pipe(parse());
// Intialise count
let count = 0;
// Iterate through each records
for await (const record of parser) {
  if (count++ === 0) {
    // 1. Extract the columns names from the first line
    headers = record;
  } else {
    // 2. Keep in memory only one column out of the all dataset
    third_column.push(record[2]);
  }
}
// Validation
assert.deepStrictEqual(headers, [
  "OMH",
  "ONKCHhJmjadoA",
  "D",
  "GeACHiN",
  "nnmiN",
  "CGfDKB",
  "NIl",
  "JnnmjadnmiNL",
]);
assert.deepStrictEqual(third_column, [
  "fENL",
  "gGeBFaeAC",
  "jPbhKCHhJn",
  "DKCHjONKCHi",
  "LEPPbgI",
  "dmkeACHgG",
  "BDLDLF",
  "C",
  "kdnmiLENJo",
  "A",
  "PPaeACGfCIkcj",
  "oABFaepBFbgGeBFb",
  "ENJnmj",
  "dlhKAABGdlhJnn",
  "OPPPbfDK",
  "PbgGeoACJmjPa",
  "LD",
  "lfDKBFbhKp",
  "LE",
  "lhIkepCIkdmjbhI",
  "jPPadnlhIl",
  "Ge",
  "ONKACJnlhJnnm",
  "NLF",
  "clfCGepBFaeBDL",
  "kdmiN",
  "AACIlf",
  "jPbfE",
  "gHiN",
  "GclgHgG",
  "CJnmjPbhJoA",
  "nlhKCGeABFcjPbh",
  "afCJnmiMIleBE",
  "fDMHgHhJnlhKBF",
  "keAADJopDL",
  "mjaclgFciO",
  "LE",
  "EONKCH",
  "gFckdnnnooABEN",
  "pCIlgGfCHhKAABDM",
  "clgFaeBGdmjPbh",
  "jPbgGdnnmjbgGfE",
  "MGdmkepE",
  "GfDLEPa",
  "JopEOMGfEOON",
  "jbfEPPbiMG",
  "CHgGeACJnmkclfDK",
  "bhJ",
  "gIjP",
  "pDKACIjPaep",
  "fDMG",
  "Kp",
  "gFcj",
  "DJpBFbgFaeA",
  "iLFbgGdnl",
  "Jn",
  "ADJopC",
  "eACGfCJnmjONLF",
  "Ge",
  "NKAADJnn",
  "iMHh",
  "PadnlgHgHiMGd",
  "ABDJpCIjaclfEMHi",
  "nlgGf",
  "Ge",
  "B",
  "kclgFbgFbhIlgGf",
  "jbhIlgHgGf",
  "MIjPadnmkclfD",
  "Hg",
  "mjbgH",
  "GfDLDKB",
  "ENLFafCGfEN",
  "Gf",
  "hKCHiMHgFbiMIl",
  "biLEPPPafCIkdm",
  "hKpD",
  "keoBE",
  "Hg",
  "D",
  "KACHhKAABDLF",
  "NKA",
  "HiMIkep",
  "C",
  "biMGdmkdnnlgFc",
  "CGeAACJnlgG",
  "FbgGfCIkdnnl",
  "PafCHgFbiMIkb",
  "LD",
  "gGfENLEOP",
  "IjOPPPa",
  "eBFbhJpCIkdlhK",
  "IjPbhIlfDMGf",
  "dnmlfCGepCHhIm",
  "nmjPaeoACIkepEM",
  "oBDLEOONIlh",
  "A",
  "NKB",
  "EOMHhIlhIkd",
]);
