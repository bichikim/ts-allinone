# Typescript all in one package
> build & test

- build by tsc
- test by mocha
- reformat by prettier-eslint
- lint by eslint & tslint

```bash
Usage: src [options] [command]

Options:
  -c, --ts-config [dir]       set a project directory (default: "tsconfig.json")
  -d, --build-dir [dir]       set a directory for built result files (default: "dist")
  -i, --include [regex]       source directories (collect able) (default: [])
  -r, --requires [file path]  require files (collect able) (default: [])
  -h, --help                  output usage information

Commands:
  build
  test
  test-watch
  coverage
  reformat

```