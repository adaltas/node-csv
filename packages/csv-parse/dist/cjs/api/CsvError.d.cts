import type { OptionsNormalized } from "../options.cjs";

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
