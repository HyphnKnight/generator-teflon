![Teflon](https://github.com/HyphnKnight/generator-teflon/blob/v1.0/source/media/images/teflonLogo.png)

Teflon is a build system designed to make polymer based application development easy.

[Setup](#setup) | [How to create a page](#how-to-create-a-page) | [How to create an element](#how-to-create-an-element)

## Setup
1. Download this repository into your project folder.
1. Install [node](https://nodejs.org/en/).
1. Run `npm install` to install all of the dependencies in the [package.json](https://github.com/HyphnKnight/Teflon/blob/master/package.json) file.
1. Remove any files not related to the build that you do not want. Below is a list of extraneous files:
  * All of the subtle elements in `source/elements/subtle/`.
  * In `source/elements/core/core-scripts/` the `underscore.js` file is extra but the `webcomponents-lite.js` file is necessary.
  * In `source/elements/core/core-styles/` you can find the `normalize.css` file, I would suggest keeping it in but its not needed for the build.
1. You should also edit the content of the following files:
  * The sample pages `source/index.jade` & `source/about.jade`.
  * The properties of `package.json` with the exception of main, scripts & dependencies.

### The command
To use Teflon, type the command `node bin/build.js`, which runs the build.js file with no arguments. This will produce an optimized uncompressed build in the `app` folder. The following are Teflon's arguments which can be used to unlock additional functionality, they also can be used concurrently:

| argument | Effect |
| ------- | ------ |
|  `--c` or `--compress` | Compress all production files |
| `--s` or `--server` | Run a development server to serve your build folder with the flag |
| `--p=XXXX` | Use a custom port |
| `--a=xxx.xx.xxx.x` | Use a custom address |
|  `--w` or `--watch` | Detect file changes and rebuild appropriately |
|  `--d` or `--debug` | Prevents the intermediate build folders from being erased |

The shortcuts in the `package.json` file can ease developement: `npm run dev` is an alias for `node bin/build.js --d --w --s` which sets up a developement enviroment; `npm run build` is an alias for `node bin/build.js --c`, which generates a production build.

## How to create a page
To make a new page create a file on the top level of the `source/` folder with either a `.html` or a `.jade` ending. Once that file is made Teflon will proccess it. Its important to note that *any* jade or html file will be parsed as a page. If you want to have a secondary jade file to import into your main page place it in the `source/imports/jade/` folder. If you are creating an html file you wish to import into a page, you should read the section below.

[File Reference](#page)

### How to add elements
**Collections** are the folders right below the `source/elements/` folder. In order to add new elements to a project, first you need to add an appropriate collection folder or choose an existing one. The initial collection folders are `source/elements/subtle/` and `source/elements/core/`. The core collection has a special property, any of its element will be inlined into the page instead of being linked to. Inlined elements can be used to reduce the time to first render and interactive state.

**Elements** are created from jade files, html files or directories. To use a prebuilt element create a collection folder and drop the html file into it. For more complicated element creation see [below](#how-to-create-an-element).

[File Reference](#elements)

### How to add styles & scripts
In order to use your own external style and script files, add them to the `source/elements/core/core-scripts` folder and the `source/elements/core/core-styles` folder. You will need to add links in the `source/elements/core/core-styles/index.jade` for your styles and `source/elements/core/core-scripts/index.jade` for your scripts. This ensures the javascript files will be linted and transpiled from ES6. It also ensures css files will be compiled from sass or scss if applicable then auto-prefixed and organized. Please note these files only exist in the final project as inlined scripts and styles.

[File Reference](#scripts-and-styles)

## How to create an element
The goal of Teflon is to provide a large degree of flexibility when building out elements. For a file to be registered as an element it needs to be a template file ( `.jade` or `.html` ) located directly inside of a collection folder. Files like this must be self contained so no imported files besides other elements are to be used. If you would like to import style or script files instead create a directory. Inside this directory there must be either an `index.jade` or `index.html` file to represent the main template file. Any script, style or template file you place inside the folder will be processed. This is useful for building out elements that only exist as children of specific other elements. For example, in `source/elements/subtle/subtle-dropdown` the `subtle-dropdown-option.jade` is an element only used inside of `elements/subtle/subtle-dropdown.html`. In that same example you can see how the `option-style.css` and the `option-script.js` files are processed and parsed and inlined in the same way as the `script.js` and `style.scss` files.

[File Reference](#elements)

## With thanks to the communities and individuals who build and support the following:
* autoprefixer
* babel
* csscomb
* cssnano
* express
* fs-extra-promise
* glob
* html-minifier
* jade
* jshint
* node-sass
* node-watch
* postcss
* rsvp
* uglify-js
* underscore
* vulcanize

## Reference

### File System

#### Page
```
source/
	elements/
	imports/
		jade/
			_config.jade	<-- file to be imported into jade files
			_mixin.jade		<-- file to be imported into jade files
		sass/
			_config.scss	<-- file to be imported into sass/scss files
			_mixin.scss		<-- file to be imported into sass/scss files
	media/
	about.jade	<-- Page
	index.jade	<-- Page
```
#### Scripts and Styles
```
source/
	elements/
		core/
			core-polymer/
			core-scripts/
				index.jade
				underscore.js		<-- Global script file
				webcomponents.js	<-- Global script file
			core-styles/
				index.jade
				normalize.css		<-- Global style file
			core-structure.html
		subtle/
	imports/
		jade/
			_config.jade	<-- file to be imported into jade files
			_mixin.jade		<-- file to be imported into jade files
		sass/
			_config.scss	<-- file to be imported into sass/scss files
			_mixin.scss		<-- file to be imported into sass/scss files
	media/
	about.jade
	index.jade
```
#### Collections
```
source/
	elements/
		core/	<-- Collection ( core modules will be inlined )
		subtle/	<-- Collection ( will not be inlined )
	imports/
	media/
	about.jade
	index.jade
```
#### Elements
```
source/
	elements/
		core/
			core-polymer/
				index.jade			<-- An example of a non-polymer element
				polymer-micro.js
				polymer-mini.js
				polymer.js
			core-scripts/
				index.jade			<-- An example of a non-polymer element
				underscore.js
				webcomponents.js
			core-styles/
				index.jade
				normalize.css
			core-structure.html		<-- An example of a self contained element
		subtle/
			subtle-button/
				index.jade			<-- The main template of a folder based element
				script.js			<-- Script file to be imported
				style.scss			<-- Style file to be imported
			subtle-calendar/
				index.jade
				script.js
				style.scss
			subtle-dropdown/
				index.jade
				script.js
				style.scss
				subtle-dropdown-option.jade	<-- A secondary element defined for use with subtle-dropdown
				option-script.js			<-- script file for the secondary element
				option-style.scss			<-- style file for the secondary element
			subtle-input/
				index.jade
				script.js
				style.scss
			subtle-tabs/
				index.jade
				script.js
				style.scss
			subtle-textarea/
				index.jade
				script.js
				style.scss
	imports/
		jade/
			_config.jade	<-- file to be imported into jade files
			_mixin.jade		<-- file to be imported into jade files
		sass/
			_config.scss	<-- file to be imported into sass/scss files
			_mixin.scss		<-- file to be imported into sass/scss files
	media/
	about.jade
	index.jade
```
