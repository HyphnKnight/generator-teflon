#Teflon
Teflon is a build system that seeks to solve the limited nature of polymer construction, streamline the development process and optimize the final product.

[Setup](#setup) | [How to create a page](#how-to-create-a-page) | [How to create an element](#how-to-create-an-element) | [The build process](#the-build-process)

## Setup
1. Download this repo above into the directory you would like your project to be located.
1. Install [node](https://nodejs.org/en/) if you dont already have it.
1. Run `npm install` to install all of the dependecies in the [package.json](https://github.com/HyphnKnight/Teflon/blob/master/package.json) file.
1. Remove all the extra files included in the project that you may not want.
  * all of the subtle elements in `source/elements/subtle/`.
  * The core-structure element at `source/elements/core-structure/`, you definetly however want to keep the `core-polymer` element.
  * In `source/scripts/` the `underscore.js` file is extra but the `webcomponents.js` file is neccesary.
  * In `source/styles/normalize.css` file I would suggest keeping in but is not needed for the build.
1. You should also edit the content of the following files.
  * The existing index page source is the `source/index.jade` file, you can delete it and write your index page or not have one, however if you do keep this page I would suggest changing the title, description and taking a look on the other meta tags that are there and change them incase they reference Teflon.
  * You should change the values of the most of the properties in the `package.json` file with the exception of main, scripts, and dependencies.

## Getting Started
To use Teflon, run the command `node bin/build.js` that runs the build.js file with no arguments which will produce an optimized uncompressed production ready build in the `app` folder. The following are Teflon's arguments which can be used to unlock additional functionality. They don't step on each others toes so can be used concurrently.
| Command | Effect |
| -- | -- |
|  `--c` or `--compress` | Compress your files |
| `--s` or `--server` | Run a development server to serve your build folder with the flag |
| `--p=XXXX` | Use a custom port |
| `--a=xxx.xx.xxx.x` | Use a custom address |
|  `--w` or `--watch` | Detect file changes and rebuild appropriately |
|  `--d` or `--debug` | Prevents the intermediate build folders from being erased |

## How to create a page
Create a file on the top level of the `source/` folder with either a `.html` or a `.jade` ending. Thats it, once a file is created with either of those endings at the top level of the `source/` folder it is processed as a page and the following . Its important to note that *any* jade or html file will be parsed as a page. If you want to have a jade file to import mixins, configurations or whatever, into your pages, place it in the `source/imports/jade/` folder. If you are creating an html file you wish to import, use the `source/elements/` folder is for, details on which are [below](#how-to-add-elements).

### How to add styles & scripts
When building a polymer project, global scripts and css files are still useful. I personally use `underscore.js` and `normalize.css` as starting points for my projects. In order to use your own external libraries all you need to do is add them to the `source/scripts/` folder and the `source/styles/` folder. That ensures the javascript files will be linted and transpiled from ES6 and css files will be compiled from sass or scss if applicable then autoprefixed and organize. These files don't actually make it to the final product ever, they only exist in the final project as inlined scripts and styles that have been added to pages by vulcanize.

### How to add elements
**Collections** are the folders right below the `source/elements/` folder. In order to add new polymer elements to a project, first you need to add a collection folder or choose an existing one. The initial collection folders are `source/elements/subtle/` and `source/elements/core/`. The subtle collection is a normal folder and behaves like any folder you might create, however the core collection has a special property. Any element in the core collection will be inlined into the page instead of being linked to. The goal here is to reduce the time to first render and first interactiable state.

**Elements** are generated from jade files, html files or folders located inside of each collection folder. To use a prebuilt element simply create a collection folder and drop the html file in it. For more complicated element creation see [below](#how-to-create-an-element).

## How to create an element

### The pure element

### The 'some assembly required' element

## The build process
1. Move the file from the `source` folder to the `.packaged` folder converting it to an html file if it was jade.
1. Read all of the files from `source/styles` converting them if written in sass or scss into css and processsing them before adding them to `.packaged/styles`.
1. Read all of the files from `source/scripts` testing them with jslint, then transpiling them using babel before writing the resulting files to `.packaged/scripts`.
1. Read all of the top level html files in `.packaged` and vulcanize them only allowing in : the scripts in `.packaged/scripts`;  the styles `.packaged/scripts` and the elements in `.packaged/elements/core`.