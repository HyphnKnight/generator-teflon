# Teflon
Teflon is a polymer application template that seeks to optimize the work flow so as to maximize the efficency of both development and the application itself.

## Structure
###### Top Level
At the top level there are: the source folder which contains all of the files that will become our web app; the bin folder which contains all of the files used during the build process ; and the package.json file which is used to configure all our node package dependencies and contains other node and npm related information.
```
/bin
/source
/package.json
```
###### Source Dir
Inside of an example source folder for a project with two pages: index and about. The source folder contains a directory for the elements to be used by the project as well as a folder for each individual page.
```
/source
/source/elements
/source/index
/source/about
```
###### Page Dir
A page folder is a fairly basic setup, its assembled using a combination of vulcanize and other post processing tools.
```
/source/index
/source/index/main.jade
/source/index/style.scss
/source/index/script.js
```
#### Polymer Element
Wherever one could put a polymer element the following setups are considered viable, the most basic of which is the single html file which will not be processed only moved around.
```
/source/elements/input/
/source/elements/input/dropdown.html
```
The next is the broken up polymer file, which will have its script and style files imported into it using vulcanize, before its copied.
```
/source/elements/input/
/source/elements/input/text
/source/elements/input/text/main.html // Can be jade
/source/elements/input/text/script.js   // Can be es6
/source/elements/input/text/style.css  // Can be scss or sass
```
###### Elements Dir
This is the elements folder of an example project with two unique types of modules: inputs & albums. These folders are simply for conceptual organization as their names and seperation only change the way they are referenced. However the core folder is very important, as any polymer element in the core folder will be embedded into page using vulcanize and not load in using html imports. This folder should be used for core elements of the applications structure such as menu bars and page sections.
```
/source/elements
/source/elements/core
/source/elements/inputs
/source/elements/albums
```
###### Core Dir
A  core element might be the menu bar module.
```
/source/elements/core/
/source/elements/core/menu
/source/elements/core/menu/main.jade
/source/elements/core/menu/script.js
/source/elements/core/menu/style.js
```
A common element might be a jsDependencies module which includes all the javascript dependencies that the modules in this project use.
```
/source/elements/core/
/source/elements/core/jsDependencies
/source/elements/core/jsDependencies/main.jade
/source/elements/core/jsDependencies/underscore.js
/source/elements/core/jsDependencies/skedge.js
```
###### Element Dir
A  sample element might be a text input,
```
/source/elements/input/
/source/elements/input/text
/source/elements/input/text/main.jade
/source/elements/input/text/script.js
/source/elements/input/text/style.js
```
or a dropdown selector,
```
/source/elements/input/
/source/elements/input/dropdown.html
```
or a confirm button.
```
/source/elements/input/
/source/elements/input/confirm
/source/elements/input/confirm/main.jade
/source/elements/input/confirm/script.js
/source/elements/input/confirm/style.js
```
