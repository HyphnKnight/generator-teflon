![Teflon](./source/media/images/teflonLogo.png)
Teflon is a build system designed to make polymer based application development easy through flexible design paired with thorough file processing.

[Setup](#setup) | [How to create a page](#how-to-create-a-page) | [How to create an element](#how-to-create-an-element)

## Setup
1. Download this repository into the directory you would like your project to be located.
1. Install [node](https://nodejs.org/en/) if you don't already have it.
1. Run `npm install` to install all of the dependencies in the [package.json](https://github.com/HyphnKnight/Teflon/blob/master/package.json) file.
1. Remove all the extra files included in the project that you may not want.
  * All of the subtle elements in `source/elements/subtle/`.
  * In `source/elements/core/core-scripts/` the `underscore.js` file is extra but the `webcomponents.js` file is necessary.
  * In `source/elements/core/core-styles/` you can find the `normalize.css` file, I would suggest keeping it in but its not needed for the build.
1. You should also edit the content of the following files.
  * The existing pages are the `source/index.jade` & `source/about.jade` file, you can delete them and write new pages, however if you do keep them I would suggest changing the title and description as well taking a look at the other meta tags and change them incase they reference Teflon.
  * You should alter most of the properties in the `package.json` file with the exception of main, scripts, and dependencies.

### The command
To use Teflon, run the command `node bin/build.js` that runs the build.js file with no arguments which will produce an optimized uncompressed production ready build in the `app` folder. The following are Teflon's arguments which can be used to unlock additional functionality. They don't step on each others toes so can be used concurrently.

| argument | Effect |
| ------- | ------ |
|  `--c` or `--compress` | Compress all production files |
| `--s` or `--server` | Run a development server to serve your build folder with the flag |
| `--p=XXXX` | Use a custom port |
| `--a=xxx.xx.xxx.x` | Use a custom address |
|  `--w` or `--watch` | Detect file changes and rebuild appropriately |
|  `--d` or `--debug` | Prevents the intermediate build folders from being erased |

I also added some shortcuts into the package file to ease developement. `npm run dev` is an alias for `node bin/build.js --d --w --s` my most used developement command. `npm run build` is an alias for `node bin/build.js --c` which I suggest to use for production builds.

## How to create a page
To make a new page create a file on the top level of the `source/` folder with either a `.html` or a `.jade` ending. Once that file is made Teflon will proccess it. Its important to note that *any* jade or html file will be parsed as a page. If you want to have a secondary jade file to import into your main page place it in the `source/imports/jade/` folder. If you are creating an html file you wish to import into a page, you should read the section below.

[File Reference](#page)

### How to add elements
**Collections** are the folders right below the `source/elements/` folder. In order to add new elements to a project, first you need to add an appropriate collection folder or choose an existing one. The initial collection folders are `source/elements/subtle/` and `source/elements/core/`. The subtle collection is a normal collection and behaves like any collection you might create, however the core collection has a special property. Any element in the core collection will be inlined into the page instead of being linked to. The goal here is to reduce the time to first render and first interactive state.

**Elements** are generated from jade files, html files or folders located inside of each collection folder. To use a prebuilt element simply create a collection folder and drop the html file in it. For more complicated element creation see [below](#how-to-create-an-element).

[File Reference](#elements)

### How to add styles & scripts
When building a polymer project, global scripts and css files are still useful. I personally use `underscore.js` and `normalize.css` as starting points for my projects. In order to use your own external libraries all you need to do is add them to the `source/elements/core/core-scripts` folder and the `source/elements/core/core-styles` folder. You will need to add links in the `source/elements/core/core-styles/index.jade` for your styles and `source/elements/core/core-scripts/index.jade` for your scripts. This ensures the javascript files will be linted and transpiled from ES6 and css files will be compiled from sass or scss if applicable then auto-prefixed and organized. These files don't actually make it to the final product, they only exist in the final project as inlined scripts and styles.

[File Reference](#scripts-and-styles)

## How to create an element
The goal of Teflon is to provide a large degree of flexibility when building out elements. For a file to be understood as element to be processed it needs to be either a template file ( `.jade` or `.html` ) located directly inside of a collection folder. Files like this must be self contained, which means no imported files besides other elements. The other type of element is defined by creating a folder underneath a collection. Inside this folder must be either an `index.jade` or `index.html` file to represent the main template file to deliver. Any file you place inside the folder will be processed: script files; style files; and even other template files. I find this useful for building out elements that only exist as children of specific other elements. For example, in `source/elements/subtle/subtle-dropdown` the `subtle-dropdown-option.jade` is an element only used inside of `elements/subtle/subtle-dropdown.html`. In that same example you can see how the `option-style.css` and the `option-script.js` files are processed and parsed and inlined in the same way as the `script.js` and `style.scss` files.

[File Reference](#elements)

## With thanks to the communities and individuals who build and support the following...
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
			_config.jade	<-- file to be imported across the project into jade files
			_mixin.jade		<-- file to be imported across the project into jade files
		sass/
			_config.scss	<-- file to be imported across the project into sass/scss files
			_mixin.scss		<-- file to be imported across the project into sass/scss files
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
			_config.jade	<-- file to be imported across the project into jade files
			_mixin.jade		<-- file to be imported across the project into jade files
		sass/
			_config.scss	<-- file to be imported across the project into sass/scss files
			_mixin.scss		<-- file to be imported across the project into sass/scss files
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
			_config.jade	<-- file to be imported across the project into jade files
			_mixin.jade		<-- file to be imported across the project into jade files
		sass/
			_config.scss	<-- file to be imported across the project into sass/scss files
			_mixin.scss		<-- file to be imported across the project into sass/scss files
	media/
	about.jade
	index.jade
```
