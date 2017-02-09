# codebase-review

A handy command-line tool for reviewing an __entire__ code base.

## Usage

Usage:

```sh
npm i -g codebase-review

cd /your/repo
codebase-review
```

## How it works

- Create a completely empty orphan branch called `empty`
- Create a copy of your master branch called `project`
- Pushes both branches to your origin

Once both branches are pushed, make a Pull Request with the base set to `empty` and the compare branch set to `project`.

__Tada!__ You can now review an entire code base.
