# Typescript all in one package
> build & test

- build by tsc
- test by mocha
- reformat by prettier-eslint
- lint by eslint & tslint

```bash
Usage: index [options] [command]

Commands:
  build
  test
  test-watch
  reformate
  coverage

Options:
  -c, --ts-config [dir]  set a project directory (default: "tsConfig.json")
  -d, --build-dir [dir]  set a directory for built result files (default: "dist") (only: build)
  -i, --include [a, b]   source directories (default: "src/**/*.ts") (test default: "test/**/*.spec.ts")
  -r, --requires [a, b]  require files
  -h, --help             output usage information

```