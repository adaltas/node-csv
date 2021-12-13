
# `webpack` bunder demonstration

The project is built with `webpack` version 5. It follows the official [getting started](https://webpack.js.org/guides/getting-started/).

## Architecture

The application serves one [HTML page](./dist/index.html) on port `8080` available at `http://localhost:8080`.

The JavaScript source code is located in [`./src` folder](./src/). Choose the script according to your usage. Each script imports the necessary package from the [CSV project](https://csv.js.org/). Following the getting started instructions, `webpack` reads this file and generates a new bundle in [`./lib/` folder](./lib/).

The `webpack` configuration file is located in [`./webpack.config.js`](./webpack.config.js).

## Usage

Install the project:

```bash
git clone https://github.com/adaltas/node-csv.git csv
cd csv/demo/webpack
```

Bundle the JavaScript modules:

```bash
npm run build
# Or
npx webpack --config webpack.config.js
```

Start the web application:

```bash
npm run start
# Or
npx http-server ./dist -p 8080
```

The web application is now accessible on [`https://localhost:8080`](https://localhost:8080).

## Testing

The test suite consists in building the code with webpack. We don't check if the code is working.
