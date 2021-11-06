# Roadmap

Below is the list of upgrades we are considering for the next major release. The majority of them are just simple refactoring. They will however introduce backward incompatibilities.

We invite you to join and contribute but create an issue before engaging any work. Some tasks are scheduled for another time or might depends on another one.

* `max_comment_size`: new option (medium)
* promise: new API module (medium)
* errors: finish normalisation of all errors (easy)
* encoding: new encoding_input and encoding_output options (medium)
* `columns_duplicates_to_array`: this is just too long but I don't have much insipiration for a better name
* `relax_column_count`: rename INCONSISTENT_RECORD_LENGTH to RECORD_INCONSISTENT_FIELDS_LENGTH (easy)
* `relax_column_count`: rename RECORD_DONT_MATCH_COLUMNS_LENGTH to RECORD_INCONSISTENT_COLUMNS (easy)
* `info`: remove the `parser.info` object and move its properties to `state`
* `info`: rename the `info` related properties and functions to `context`
