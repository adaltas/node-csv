import assert from "node:assert/strict";
import { parse, CsvError, normalize_options } from "../lib/iterator.js";
import type { Options, InfoRecord } from "../lib/iterator.js";

async function* input() {
  yield "name,age\nAlice,20";
}

describe("API iterator types", function () {
  it("returns an async generator of default records", async function () {
    const records: AsyncGenerator<string[], void, unknown> = parse(input());
    assert.deepEqual((await records.next()).value, ["name", "age"]);
    await records.return();
  });

  it("supports typed columns and on_record", async function () {
    interface Person {
      name: string;
      age: number;
    }
    interface Name {
      name: string;
    }
    const options: Options<Name, Person> = {
      columns: true,
      cast: true,
      on_record: (person: Person, context: InfoRecord) => ({
        name: `${person.name}:${context.records}`,
      }),
    };
    const records: AsyncGenerator<Name, void, unknown> = parse<Name, Person>(
      input(),
      options,
    );
    assert.deepEqual((await records.next()).value, { name: "Alice:1" });
  });

  it("uses non-stream options and exports helpers", function () {
    const options: Options = { delimiter: ":" };
    normalize_options(options);
    const error: CsvError = new CsvError("CSV_INVALID_ARGUMENT", "test");
    assert.equal(error.code, "CSV_INVALID_ARGUMENT");
    // @ts-expect-error The portable entry does not accept Node stream options.
    parse(input(), { highWaterMark: 1 });
  });
});
