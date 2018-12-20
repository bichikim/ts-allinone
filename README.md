# Typescript all in one package
> build & test

- build by tsc
- test by mocha
- reformat by prettier-eslint
- lint by eslint & tslint

## How to use

```
Usage: ts-aio [options] [command]

Options:
  -c, --ts-config [dir]       set a project directory (default: "tsconfig.json")
  -d, --build-dir [dir]       set a directory for built result files (default: "dist")
  -i, --include [regex]       source directories (collect able) (default: [])
  -t, --test [regex]          test directories(collect able, test only) (default: [])
  -r, --requires [file path]  require files (collect able) (default: [])
  -h, --help                  output usage information

Commands:
 build        build ts to js
 test         test codes
 test-watch   watch testing codes
 coverage     measure test coverage
 reformat     format code style
 init         copy config files for your project

```

## Files for IDE

- tslint config file: `node_modules/ts-aio/tslint.json`
- eslint config file: `node_modules/ts-aio/.eslintrc.js`
- nyc config file: `node_modules/ts-aio/.nycrc`
- ts-node register: `node_modules/ts-node/register.js`
- tsconfig-path register: `node_modules/tsconfig-paths/register.js`

## Run mocha manually

```bash
yarn mocha -r ts-node/register -r tsconfig-paths/register "test/**/*.spec.ts"
```

## Run nyc manually

```bash
yarn nyc -r ts-node/register -r tsconfig-paths/register mocha -r ts-node/register -r tsconfig-paths/register "test/**/*.spec.ts"
```
