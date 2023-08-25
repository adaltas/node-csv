
# TypeScript with CommonJS and moduleresolution set to node16

This demo is created after issue #354. The package is defined as CommonJS. The code, written in TypeScript, import each CSV packages, for example with `import { parse, Parser } from 'csv-parse';`.

## Original error

The original issue describes how TypeScript failed to import from a CommonJS package. For example with `tsc`:

```bash
$ tsc
main.ts:1:23 - error TS1471: Module 'csv-parse' cannot be imported using this construct. The specifier only resolves to an ES module, which cannot be imported synchronously. Use dynamic import instead.

1 import { parse } from 'csv-parse';
                        ~~~~~~~~~~~


Found 1 error in main.ts:1
```

To fix this, the demo used the following `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "CommonJS",
    "moduleResolution": "node16",
    "strict": true
  }
}
```

## Second error

After the upgrade of TypeScript from version `^5.1.6` to `^5.2.2`, a new error is thrown:

```bash
$ yarn test
yarn run v1.22.19
$ tsc --noEmit
tsconfig.json:4:15 - error TS5110: Option 'module' must be set to 'Node16' when option 'moduleResolution' is set to 'Node16'.

4     "module": "CommonJS",
                ~~~~~~~~~~


Found 1 error in tsconfig.json:4

error Command failed with exit code 2.
```


To fix this, the demo now uses the following `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "node16",
    "moduleResolution": "node16",
    "strict": true
  }
}
```
