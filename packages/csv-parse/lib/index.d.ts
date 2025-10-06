// Original definitions in https://github.com/DefinitelyTyped/DefinitelyTyped by: David Muller <https://github.com/davidm77>

/// <reference types="node" />

import * as stream from "stream";

export type Callback<T = string[]> = (
  err: CsvError | undefined,
  records: T[],
  info?: InfoCallback,
) => void;

export class Parser extends stream.Transform {
  constructor(options: Options);

  // __push(line: T): CsvError | undefined;
  // __push(line: any): CsvError | undefined;

  // __write(chars: any, end: any, callback: any): any;

  readonly options: OptionsNormalized;

  readonly info: Info;
}

export interface Info {
  /**
   * The number of processed bytes.
   */
  readonly bytes: number;
  /**
   * The number of processed bytes until the last successfully parsed and emitted records.
   */
  readonly bytes_records: number;
  /**
   * The number of lines being fully commented.
   */
  readonly comment_lines: number;
  /**
   * The number of processed empty lines.
   */
  readonly empty_lines: number;
  /**
   * The number of non uniform records when `relax_column_count` is true.
   */
  readonly invalid_field_length: number;
  /**
   * The number of lines encountered in the source dataset, start at 1 for the first line.
   */
  readonly lines: number;
  /**
   * The number of processed records.
   */
  readonly records: number;
}

export interface InfoCallback extends Info {
  /**
   * Normalized version of `options.columns` when `options.columns` is true, boolean otherwise.
   */
  readonly columns: boolean | { name: string }[] | { disabled: true }[];
}

export interface InfoDataSet extends Info {
  readonly column: number | string;
}

export interface InfoRecord extends InfoDataSet {
  readonly error: CsvError;
  readonly header: boolean;
  readonly index: number;
  readonly raw: string | undefined;
}

export interface InfoField extends InfoRecord {
  readonly quoting: boolean;
}

/**
 * @deprecated Use the InfoField interface instead, the interface will disappear in future versions.
 */
// eslint-disable-next-line
export interface CastingContext extends InfoField {}

export type CastingFunction = (value: string, context: InfoField) => unknown;

export type CastingDateFunction = (value: string, context: InfoField) => Date;

export type ColumnOption<K = string> =
  | K
  | undefined
  | null
  | false
  | { name: K };

export interface OptionsNormalized<T = string[], U = T> {
  auto_parse?: boolean | CastingFunction;
  auto_parse_date?: boolean | CastingDateFunction;
  /**
   * If true, detect and exclude the byte order mark (BOM) from the CSV input if present.
   */
  bom?: boolean;
  /**
   * If true, the parser will attempt to convert input string to native types.
   * If a function, receive the value as first argument, a context as second argument and return a new value. More information about the context properties is available below.
   */
  cast?: boolean | CastingFunction;
  /**
   * If true, the parser will attempt to convert input string to dates.
   * If a function, receive the value as argument and return a new value. It requires the "auto_parse" option. Be careful, it relies on Date.parse.
   */
  cast_date?: boolean | CastingDateFunction;
  /**
   * Internal property string the function to
   */
  cast_first_line_to_header?: (
    record: T,
  ) => ColumnOption<
    T extends string[] ? string : T extends unknown ? string : keyof T
  >[];
  /**
   * List of fields as an array, a user defined callback accepting the first
   * line and returning the column names or true if autodiscovered in the first
   * CSV line, default to null, affect the result data set in the sense that
   * records will be objects instead of arrays.
   */
  columns:
    | boolean
    | ColumnOption<
        T extends string[] ? string : T extends unknown ? string : keyof T
      >[];
  /**
   * Treat all the characters after this one as a comment, default to '' (disabled).
   */
  comment: string | null;
  /**
   * Restrict the definition of comments to a full line. Comment characters
   * defined in the middle of the line are not interpreted as such. The
   * option require the activation of comments.
   */
  comment_no_infix: boolean;
  /**
   * Set the field delimiter. One character only, defaults to comma.
   */
  delimiter: Buffer[];
  /**
   * Set the source and destination encoding, a value of `null` returns buffer instead of strings.
   */
  encoding: BufferEncoding | null;
  /**
   * Set the escape character, one character only, defaults to double quotes.
   */
  escape: null | Buffer;
  /**
   * Start handling records from the requested number of records.
   */
  from: number;
  /**
   * Start handling records from the requested line number.
   */
  from_line: number;
  /**
   * Convert values into an array of values when columns are activated and
   * when multiple columns of the same name are found.
   */
  group_columns_by_name: boolean;
  /**
   * Don't interpret delimiters as such in the last field according to the number of fields calculated from the number of columns, the option require the presence of the `column` option when `true`.
   */
  ignore_last_delimiters: boolean | number;
  /**
   * Generate two properties `info` and `record` where `info` is a snapshot of the info object at the time the record was created and `record` is the parsed array or object.
   */
  info: boolean;
  /**
   * If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.
   * Does not remove whitespace in a quoted field.
   */
  ltrim: boolean;
  /**
   * Maximum number of characters to be contained in the field and line buffers before an exception is raised,
   * used to guard against a wrong delimiter or record_delimiter,
   * default to 128000 characters.
   */
  max_record_size: number;
  /**
   * Name of header-record title to name objects by.
   */
  objname: number | string | undefined;
  /**
   * Alter and filter records by executing a user defined function.
   */
  on_record?: (record: U, context: InfoRecord) => T | null | undefined;
  /**
   * Function called when an error occurred if the `skip_records_with_error`
   * option is activated.
   */
  on_skip?: (err: CsvError | undefined, raw: string | undefined) => undefined;
  /**
   * Optional character surrounding a field, one character only, defaults to double quotes.
   */
  quote?: Buffer | null;
  /**
   * Generate two properties raw and row where raw is the original CSV row content and row is the parsed array or object.
   */
  raw: boolean;
  /**
   * One or multiple characters used to delimit record rows; defaults to auto discovery if not provided.
   * Supported auto discovery method are Linux ("\n"), Apple ("\r") and Windows ("\r\n") row delimiters.
   */
  record_delimiter: Buffer[];
  /**
   * Discard inconsistent columns count, default to false.
   */
  relax_column_count: boolean;
  /**
   * Discard inconsistent columns count when the record contains less fields than expected, default to false.
   */
  relax_column_count_less: boolean;
  /**
   * Discard inconsistent columns count when the record contains more fields than expected, default to false.
   */
  relax_column_count_more: boolean;
  /**
   * Preserve quotes inside unquoted field.
   */
  relax_quotes: boolean;
  /**
   * If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.
   * Does not remove whitespace in a quoted field.
   */
  rtrim: boolean;
  /**
   * Dont generate empty values for empty lines.
   * Defaults to false
   */
  skip_empty_lines: boolean;
  /**
   * Don't generate records for lines containing empty column values (column matching /\s*\/), defaults to false.
   */
  skip_records_with_empty_values: boolean;
  /**
   * Skip a line with error found inside and directly go process the next line.
   */
  skip_records_with_error: boolean;
  /**
   * Stop handling records after the requested number of records.
   */
  to: number;
  /**
   * Stop handling records after the requested line number.
   */
  to_line: number;
  /**
   * If true, ignore whitespace immediately around the delimiter, defaults to false.
   * Does not remove whitespace in a quoted field.
   */
  trim: boolean;
}

/*
Note, could not `extends stream.TransformOptions` because encoding can be
BufferEncoding and undefined as well as null which is not defined in the
extended type.
*/
export interface Options<T = string[], U = T> {
  /**
   * If true, the parser will attempt to convert read data types to native types.
   * @deprecated Use {@link cast}
   */
  auto_parse?: boolean | CastingFunction;
  autoParse?: boolean | CastingFunction;
  /**
   * If true, the parser will attempt to convert read data types to dates. It requires the "auto_parse" option.
   * @deprecated Use {@link cast_date}
   */
  auto_parse_date?: boolean | CastingDateFunction;
  autoParseDate?: boolean | CastingDateFunction;
  /**
   * If true, detect and exclude the byte order mark (BOM) from the CSV input if present.
   */
  bom?: OptionsNormalized["bom"];
  /**
   * If true, the parser will attempt to convert input string to native types.
   * If a function, receive the value as first argument, a context as second argument and return a new value. More information about the context properties is available below.
   */
  cast?: OptionsNormalized["cast"];
  /**
   * If true, the parser will attempt to convert input string to dates.
   * If a function, receive the value as argument and return a new value. It requires the "auto_parse" option. Be careful, it relies on Date.parse.
   */
  cast_date?: OptionsNormalized["cast_date"];
  castDate?: OptionsNormalized["cast_date"];
  /**
   * List of fields as an array,
   * a user defined callback accepting the first line and returning the column names or true if autodiscovered in the first CSV line,
   * default to null,
   * affect the result data set in the sense that records will be objects instead of arrays.
   */
  columns?:
    | OptionsNormalized["columns"]
    | ((
        record: T,
      ) => ColumnOption<
        T extends string[] ? string : T extends unknown ? string : keyof T
      >[]);
  /**
   * Treat all the characters after this one as a comment, default to '' (disabled).
   */
  comment?: OptionsNormalized["comment"] | boolean;
  /**
   * Restrict the definition of comments to a full line. Comment characters
   * defined in the middle of the line are not interpreted as such. The
   * option require the activation of comments.
   */
  comment_no_infix?: OptionsNormalized["comment_no_infix"] | null;
  /**
   * Set the field delimiter. One character only, defaults to comma.
   */
  delimiter?:
    | OptionsNormalized["comment_no_infix"]
    | string
    | string[]
    | Buffer;
  /**
   * Set the source and destination encoding, a value of `null` returns buffer instead of strings.
   */
  encoding?: OptionsNormalized["encoding"] | boolean | undefined;
  /**
   * Set the escape character, one character only, defaults to double quotes.
   */
  escape?: OptionsNormalized["escape"] | string | boolean;
  /**
   * Start handling records from the requested number of records.
   */
  from?: OptionsNormalized["from"] | string;
  /**
   * Start handling records from the requested line number.
   */
  from_line?: OptionsNormalized["from_line"] | null | string;
  fromLine?: OptionsNormalized["from_line"] | null | string;
  /**
   * Convert values into an array of values when columns are activated and
   * when multiple columns of the same name are found.
   */
  group_columns_by_name?: OptionsNormalized["group_columns_by_name"];
  groupColumnsByName?: OptionsNormalized["group_columns_by_name"];
  /**
   * Don't interpret delimiters as such in the last field according to the number of fields calculated from the number of columns, the option require the presence of the `column` option when `true`.
   */
  ignore_last_delimiters?: OptionsNormalized["ignore_last_delimiters"];
  /**
   * Generate two properties `info` and `record` where `info` is a snapshot of the info object at the time the record was created and `record` is the parsed array or object.
   */
  info?: OptionsNormalized["info"];
  /**
   * If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.
   * Does not remove whitespace in a quoted field.
   */
  ltrim?: OptionsNormalized["ltrim"] | null;
  /**
   * Maximum number of characters to be contained in the field and line buffers before an exception is raised,
   * used to guard against a wrong delimiter or record_delimiter,
   * default to 128000 characters.
   */
  max_record_size?: OptionsNormalized["max_record_size"] | null | string;
  maxRecordSize?: OptionsNormalized["max_record_size"];
  /**
   * Name of header-record title to name objects by.
   */
  objname?: OptionsNormalized["objname"] | Buffer | null;
  /**
   * Alter and filter records by executing a user defined function.
   */
  on_record?: (record: U, context: InfoRecord) => T | null | undefined | U;
  onRecord?: (record: U, context: InfoRecord) => T | null | undefined | U;
  /**
   * Function called when an error occurred if the `skip_records_with_error`
   * option is activated.
   */
  on_skip?: OptionsNormalized["on_skip"];
  onSkip?: OptionsNormalized["on_skip"];
  /**
   * Optional character surrounding a field, one character only, defaults to double quotes.
   */
  quote?: OptionsNormalized["quote"] | string | boolean;
  /**
   * Generate two properties raw and row where raw is the original CSV row content and row is the parsed array or object.
   */
  raw?: OptionsNormalized["raw"] | null;
  /**
   * One or multiple characters used to delimit record rows; defaults to auto discovery if not provided.
   * Supported auto discovery method are Linux ("\n"), Apple ("\r") and Windows ("\r\n") row delimiters.
   */
  record_delimiter?:
    | OptionsNormalized["record_delimiter"]
    | string
    | Buffer
    | null
    | (string | null)[];
  recordDelimiter?:
    | OptionsNormalized["record_delimiter"]
    | string
    | Buffer
    | null
    | (string | null)[];
  /**
   * Discard inconsistent columns count, default to false.
   */
  relax_column_count?: OptionsNormalized["relax_column_count"] | null;
  relaxColumnCount?: OptionsNormalized["relax_column_count"] | null;
  /**
   * Discard inconsistent columns count when the record contains less fields than expected, default to false.
   */
  relax_column_count_less?: OptionsNormalized["relax_column_count_less"] | null;
  relaxColumnCountLess?: OptionsNormalized["relax_column_count_less"] | null;
  /**
   * Discard inconsistent columns count when the record contains more fields than expected, default to false.
   */
  relax_column_count_more?: OptionsNormalized["relax_column_count_more"] | null;
  relaxColumnCountMore?: OptionsNormalized["relax_column_count_more"] | null;
  /**
   * Preserve quotes inside unquoted field.
   */
  relax_quotes?: OptionsNormalized["relax_quotes"] | null;
  relaxQuotes?: OptionsNormalized["relax_quotes"] | null;
  /**
   * If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.
   * Does not remove whitespace in a quoted field.
   */
  rtrim?: OptionsNormalized["rtrim"] | null;
  /**
   * Dont generate empty values for empty lines.
   * Defaults to false
   */
  skip_empty_lines?: OptionsNormalized["skip_empty_lines"] | null;
  skipEmptyLines?: OptionsNormalized["skip_empty_lines"] | null;
  /**
   * Don't generate records for lines containing empty column values (column matching /\s*\/), defaults to false.
   */
  skip_records_with_empty_values?:
    | OptionsNormalized["skip_records_with_empty_values"]
    | null;
  skipRecordsWithEmptyValues?:
    | OptionsNormalized["skip_records_with_empty_values"]
    | null;
  /**
   * Skip a line with error found inside and directly go process the next line.
   */
  skip_records_with_error?: OptionsNormalized["skip_records_with_error"] | null;
  skipRecordsWithError?: OptionsNormalized["skip_records_with_error"] | null;
  /**
   * Stop handling records after the requested number of records.
   */
  to?: OptionsNormalized["to"] | null | string;
  /**
   * Stop handling records after the requested line number.
   */
  to_line?: OptionsNormalized["to_line"] | null | string;
  toLine?: OptionsNormalized["to_line"] | null | string;
  /**
   * If true, ignore whitespace immediately around the delimiter, defaults to false.
   * Does not remove whitespace in a quoted field.
   */
  trim?: OptionsNormalized["trim"] | null;
}

export type CsvErrorCode =
  | "CSV_INVALID_ARGUMENT"
  | "CSV_INVALID_CLOSING_QUOTE"
  | "CSV_INVALID_COLUMN_DEFINITION"
  | "CSV_INVALID_COLUMN_MAPPING"
  | "CSV_INVALID_OPTION_BOM"
  | "CSV_INVALID_OPTION_CAST"
  | "CSV_INVALID_OPTION_CAST_DATE"
  | "CSV_INVALID_OPTION_COLUMNS"
  | "CSV_INVALID_OPTION_COMMENT"
  | "CSV_INVALID_OPTION_DELIMITER"
  | "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME"
  | "CSV_INVALID_OPTION_ON_RECORD"
  | "CSV_MAX_RECORD_SIZE"
  | "CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE"
  | "CSV_OPTION_COLUMNS_MISSING_NAME"
  | "CSV_QUOTE_NOT_CLOSED"
  | "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH"
  | "CSV_RECORD_INCONSISTENT_COLUMNS"
  | "CSV_UNKNOWN_ERROR"
  | "INVALID_OPENING_QUOTE";

export class CsvError extends Error {
  readonly code: CsvErrorCode;
  [key: string]: unknown;

  constructor(
    code: CsvErrorCode,
    message: string | string[],
    options?: OptionsNormalized,
    ...contexts: unknown[]
  );
}

export type OptionsWithColumns<T, U = T> = Omit<Options<T, U>, "columns"> & {
  columns: Exclude<Options["columns"], undefined | false>;
};

declare function parse<T = unknown, U = T>(
  input: string | Buffer | Uint8Array,
  options: OptionsWithColumns<T, U>,
  callback?: Callback<T>,
): Parser;
declare function parse(
  input: string | Buffer | Uint8Array,
  options: Options,
  callback?: Callback,
): Parser;

declare function parse<T = unknown, U = T>(
  options: OptionsWithColumns<T, U>,
  callback?: Callback<T>,
): Parser;
declare function parse(options: Options, callback?: Callback): Parser;

declare function parse(
  input: string | Buffer | Uint8Array,
  callback?: Callback,
): Parser;
declare function parse(callback?: Callback): Parser;

// export default parse;
export { parse };

declare function normalize_options(opts: Options): OptionsNormalized;
export { normalize_options };
