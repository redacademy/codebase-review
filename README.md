# codebase-review

A handy command-line tool for reviewing an __entire__ code base.

## Usage

Usage:

```sh
npm i -g codebase-review

cd /your/repo
codebase-review

# If you want a prefix for your branch other than 'codebase-review', pass it in
codebase-review --prefix=github-code-review
```

## Checking for Changes

By default, `codebase-review` will not run if any changes have been made to `HEAD`.
If you wish to force a review, run:

```
codebase-review --ignore-changes
```

## How it works

- Create a completely empty orphan branch called `codebase-review-empty`
- Create a copy of your master branch called `codebase-review-project`
- Pushes both branches to your origin

Once both branches are pushed, make a Pull Request with the base set to `codebase-review-empty`
and the compare branch set to `codebase-review-project`.

__Tada!__ You can now review an entire code base.
