// Original definitions in https://github.com/DefinitelyTyped/DefinitelyTyped by: David Muller <https://github.com/davidm77>

/// <reference types="node" />

import * as stream from "stream";

export = parse;

declare function parse(input: string, options?: parse.Options, callback?: parse.Callback): parse.Parser;
declare function parse(input: string, callback?: parse.Callback): parse.Parser;
declare function parse(options?: parse.Options, callback?: parse.Callback): parse.Parser;
declare function parse(callback?: parse.Callback): parse.Parser;
declare namespace parse {
    type Callback = (err: any | Error, output: any) => void;

    type MatcherFunc = (value: any) => boolean;

    interface Parser extends stream.Transform {}

    class Parser {
        constructor(options: Options);

        __push(line: any): any;

        __write(chars: any, end: any, callback: any): any;

        /**
         * Internal counter of records being processed.
         */
        readonly count: number;

        /**
         * Internal counter of empty lines
         */
        readonly empty_line_count: number;

        /**
         * Number of non uniform lines skipped when relax_column_count is true.
         */
        readonly skipped_line_count: number;

        /**
         * The number of lines encountered in the source dataset, start at 1 for the first line.
         */
        readonly lines: number;

        /**
         * The regular expression or function used to determine if a value should be cast to an integer.
         */
        readonly is_int: RegExp | MatcherFunc;

        /**
         * The regular expression or function used to determine if a value should be cast to a float.
         */
        readonly is_float: RegExp | MatcherFunc
    }

    interface CastingContext {
        column?: string;
        count: number;
        index: number;
        header: boolean;
        quoting: boolean;
        lines: number;
    }

    type CastingFunction = (value: string, context: CastingContext) => any;

    type CastingDateFunction = (value: string, context: CastingContext) => Date;

    interface Options {
        /**
         * If true, the parser will attempt to convert read data types to native types.
         * @deprecated Use {@link cast}
         */
        auto_parse?: boolean | CastingFunction;

        /**
         * If true, the parser will attempt to convert read data types to dates. It requires the "auto_parse" option.
         * @deprecated Use {@link cast_date}
         */
        auto_parse_date?: boolean | CastingDateFunction;

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
         * List of fields as an array,
         * a user defined callback accepting the first line and returning the column names or true if autodiscovered in the first CSV line,
         * default to null,
         * affect the result data set in the sense that records will be objects instead of arrays.
         */
        columns?: any[] | boolean | ((line1: any) => boolean | string[]);

        /**
         * Treat all the characters after this one as a comment, default to '' (disabled).
         */
        comment?: string;

        /**
         * Set the field delimiter. One character only, defaults to comma.
         */
        delimiter?: string;

        /**
         * Set the escape character, one character only, defaults to double quotes.
         */
        escape?: string;

        /**
         * Start returning records from a particular line.
         */
        from?: number;

        /**
         * If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.
         * Does not remove whitespace in a quoted field.
         */
        ltrim?: boolean;

        /**
         * Maximum numer of characters to be contained in the field and line buffers before an exception is raised,
         * used to guard against a wrong delimiter or rowDelimiter,
         * default to 128000 characters.
         */
        max_limit_on_data_read?: number;

        /**
         * Name of header-record title to name objects by.
         */
        objname?: string;

        /**
         * Optional character surrounding a field, one character only, defaults to double quotes.
         */
        quote?: string | boolean;

        /**
         * Preserve quotes inside unquoted field.
         */
        relax?: boolean;

        /**
         * Discard inconsistent columns count, default to false.
         */
        relax_column_count?: boolean;

        /**
         * Generate two properties raw and row where raw is the original CSV row content and row is the parsed array or object.
         */
        raw?: boolean;

        /**
         * One or multiple characters used to delimit record rows; defaults to auto discovery if not provided.
         * Supported auto discovery method are Linux ("\n"), Apple ("\r") and Windows ("\r\n") row delimiters.
         */
        rowDelimiter?: string | string[];

        /**
         * If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.
         * Does not remove whitespace in a quoted field.
         */
        rtrim?: boolean;

        /**
         * Dont generate empty values for empty lines.
         * Defaults to false
         */
        skip_empty_lines?: boolean;

        /**
         * Skip a line with error found inside and directly go process the next line.
         */
        skip_lines_with_error?: boolean;

        /**
         * Don't generate records for lines containing empty column values (column matching /\s*\/), defaults to false.
         */
        skip_lines_with_empty_values?: boolean;

        /**
         * Stop returning records after a particular line.
         */
        to?: number;

        /**
         * If true, ignore whitespace immediately around the delimiter, defaults to false.
         * Does not remove whitespace in a quoted field.
         */
        trim?: boolean;
    }
}
