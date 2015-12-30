#Teflon
Teflon is a build systemn that seeks to solve the limited nature of polymer construction, streamline the development process and optimize the final product.

[Setup](#setup) | [Getting Started](#getting-started) | [Workflow](#workflow)

## Setup
1. Download this repo above into the directory you would like your project to be located.
1. Install [node](https://nodejs.org/en/) if you dont already have it.
1. Run `npm install` to install all of the dependecies in the [package.json](https://github.com/HyphnKnight/Teflon/blob/master/package.json) file.
1. Remove all the extra files included in the project that you may not want.
  * all of the subtle elements in `source/elements/subtle`.
  * The core-structure element at `source/elements/core-structure`, you definetly however want to keep the `core-polymer` element.
  * In `source/scripts` the `underscore.js` file is extra but the `webcomponents.js` file is neccesary.
  * In `source/styles/normalize.css` file I would suggest keeping in but is not needed for the build.
1. You should also edit the content of the following files.
  * The existing index page source is the `source/index.jade` file, you can delete it and write your index page or not have one, however if you do keep this page I would suggest changing the title, description and taking a look on the other meta tags that are there and change them incase they reference Teflon.
  * You should change the values of the most of the properties in the `package.json` file with the exception of main, scripts, and dependencies.
## Getting Started

## Workflow

### Pages

### Elements