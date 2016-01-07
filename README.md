#Teflon
Teflon is a build system that seeks to solve the limited nature of polymer construction, streamline the development process and optimize the final product.

[Setup](#setup) | [How to create a page](#how-to-create-a-page) | [How to create an element](#how-to-create-an-element) | [The build process](#the-build-process)

## Setup
1. Download this repo above into the directory you would like your project to be located.
1. Install [node](https://nodejs.org/en/) if you don't already have it.
1. Run `npm install` to install all of the dependencies in the [package.json](https://github.com/HyphnKnight/Teflon/blob/master/package.json) file.
1. Remove all the extra files included in the project that you may not want.
  * all of the subtle elements in `source/elements/subtle/`.
  * In `source/elements/core/core-scripts/` the `underscore.js` file is extra but the `webcomponents.js` file is necessary.
  * In `source/elements/core/core-styles/` you can find the `normalize.css` file I would suggest keeping it in but is not needed for the build.
1. You should also edit the content of the following files.
  * The existing index page source is the `source/index.jade` file, you can delete it and write your index page or not have one, however if you do keep this page I would suggest changing the title, description and taking a look on the other meta tags that are there and change them incase they reference Teflon.
  * You should change the values of the most of the properties in the `package.json` file with the exception of main, scripts, and dependencies.

### The command
To use Teflon, run the command `node bin/build.js` that runs the build.js file with no arguments which will produce an optimized uncompressed production ready build in the `app` folder. The following are Teflon's arguments which can be used to unlock additional functionality. They don't step on each others toes so can be used concurrently.

| Command | Effect |
| ------- | ------ |
|  `--c` or `--compress` | Compress all production files |
| `--s` or `--server` | Run a development server to serve your build folder with the flag |
| `--p=XXXX` | Use a custom port |
| `--a=xxx.xx.xxx.x` | Use a custom address |
|  `--w` or `--watch` | Detect file changes and rebuild appropriately |
|  `--d` or `--debug` | Prevents the intermediate build folders from being erased |

## How to create a page
Create a file on the top level of the `source/` folder with either a `.html` or a `.jade` ending. Once a file is created with either `.html` or `.jade` endings at the top level of the `source/` folder, it is processed as a page and the following . Its important to note that *any* jade or html file will be parsed as a page. If you want to have a jade file to import mixins, configurations or whatever into your pages, place it in the `source/imports/jade/` folder. If you are creating an html file you wish to import into a page, you should read the section below.

### How to add elements
**Collections** are the folders right below the `source/elements/` folder. In order to add new elements to a project, first you need to add am appropraite collection folder or choose an existing one. The initial collection folders are `source/elements/subtle/` and `source/elements/core/`. The subtle collection is a normal folder and behaves like any folder you might create, however the core collection has a special property. Any element in the core collection will be inlined into the page instead of being linked to. The goal here is to reduce the time to first render and first interactive state.

**Elements** are generated from jade files, html files or folders located inside of each collection folder. To use a prebuilt element simply create a collection folder and drop the html file in it. For more complicated element creation see [below](#how-to-create-an-element).

#### How to add styles & scripts
When building a polymer project, global scripts and css files are still useful. I personally use `underscore.js` and `normalize.css` as starting points for my projects. In order to use your own external libraries all you need to do is add them to the `source/elements/core/core-scripts` folder and the `source/elements/core/core-styles` folder. You will need to add links in the `source/elements/core/core-styles/index.jade` for your styles and `source/elements/core/core-scripts/index.jade` for your scripts. This ensures the javascript files will be linted and transpiled from ES6 and css files will be compiled from sass or scss if applicable then auto-prefixed and organized. These files don't actually make it to the final product, they only exist in the final project as inlined scripts and styles.

## How to create an element
The goal of teflon is to provide a large degree of flexibility when building out elements. Elements come in 2 different setups, the single file elements which is located directly inside of the

## The build process
1. Move the file from the `source` folder to the `.packaged` folder converting it to an html file if it was jade.
1. Read all of the files from `source/styles` converting them if written in sass or scss into css and processing them before adding them to `.packaged/styles`.
1. Read all of the files from `source/scripts` testing them with jslint, then transpiling them using babel before writing the resulting files to `.packaged/scripts`.
1. Read all of the top level html files in `.packaged` and vulcanize them only allowing in : the scripts in `.packaged/scripts`;  the styles `.packaged/scripts` and the elements in `.packaged/elements/core`.