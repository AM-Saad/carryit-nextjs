# Hoptab API and Infrastructure

This README is work-in-progress until the MVP reaches a stable state. For now, check out the following repository features:

## Features


* Prettier: Use prettier configuration for code styling and formatting
* ESLint: Add you linting rules through ESLint, which is also configured with prettier to provide you with linting warnings on formatting and styling mistakes
* nvmrc: To configure correct node version for the project, just have nvm installed and run `nvm install` which will automatically configure node version for the repository
* lintstaged: Lint and fix linting errors automatically on staged git files
* commit-lint: Lint commit message using conventional commits format
* Husky: Run pre-commit commands (Like lint-staged mentioned above, and commit message linting)
* commitizen: CLI inquiry tool that helps you write accurate commit messages following conventional commits format
*

* Github Actions: Used for managing CI/CD on github
