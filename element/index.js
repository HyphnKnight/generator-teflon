const
	generators	= require( 'yeoman-generator' ),
	path		= require( 'path' ),
	jade		= require( 'jade' ).render,
	fs			= require( 'fs-extra-promise' ),
	prompter	= require( `${__dirname}/../bin/prompter.js` ),
	log			= require( 'log' );

module.exports = generators.Base.extend({

	constructor : function ( ) {

		generators.Base.apply(this, arguments);

		this.argument('elementName', { type: String, required: true });

	},

	initializing : {

		initiated : function () {

			log.starting( 'Creating Element' );

		}

	},

	prompting : {

		collection		: prompter( 'input',
									'collection',
									'Collection :',
									'' ),

		templateType	: prompter( 'list',
									'templateType',
									'Template Language :',
									'jade',
									[	'html',
										'jade' ] ),

		styleLanguage	: prompter( 'list',
									'styleLanguage',
									'Style Language :',
									'scss',
									[	'css',
										'scss',
										'sass',
										'none' ] ),

		scriptLanguage	: prompter( 'list',
									'scriptLanguage',
									'Script Language :',
									'js',
									[	'js',
										'none' ] ),

	},

	writing : {

		directory : function () {

			log.creating( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}` );

			fs.mkdirpSync( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}` );

		},

		createFiles : function () {

			const
				templateIncludes = {
					config : path.relative( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/index.${this.config.get('templateType')}` , `${process.cwd()}/source/imports/jade/_config.jade` ),
					mixin : path.relative( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/index.${this.config.get('templateType')}` , `${process.cwd()}/source/imports/jade/_mixin.jade` )
				},
				styleIncludes = {
					config : path.relative( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/style.${this.config.get('styleLanguage')}` , `${process.cwd()}/source/imports/sass/_config.scss` ),
					mixin : path.relative( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/style.${this.config.get('styleLanguage')}` , `${process.cwd()}/source/imports/sass/_mixin.scss` )
				},
				templateBuffer = `include ${templateIncludes.config}\ninclude ${templateIncludes.mixin}\n\ndom-module#${this.config.get('collection')}-${this.elementName}\n\n\ttemplate\n\n\t\tlink(rel='stylesheet' type="text/css" href='style.css')\n\n\tscript(src='script.js')`,
				scriptBuffer = `Polymer({\n\n\tis: "${this.config.get('collection')}-${this.elementName}",\n\n\tproperties: {\n\n\t},\n\n\tready : function ( ) {\n\n\t}\n\n});`,
				styleBuffer = `@import '${styleIncludes.config}';\n@import '${styleIncludes.mixin}';\n\n:host{}`;

			log.creating( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/index.${this.config.get('templateType')}` );

			fs.writeFileSync(	`${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/index.${this.config.get('templateType')}`,
								this.config.get('templateType') === 'html' ? jade( templateBuffer , { pretty : true , filename : __filename } ) : templateBuffer,
								'utf8' );

			if ( this.config.get('scriptLanguage') !== 'none' ) {

				log.creating( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/script.js` );

				fs.writeFileSync(	`${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/script.js`,
									scriptBuffer,
									'utf8' );
			}

			if ( this.config.get('styleLanguage') !== 'none' ) {

				log.creating( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/style.${this.config.get('styleLanguage')}` );

				fs.writeFileSync(	`${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.elementName}/style.${this.config.get('styleLanguage')}`,
									styleBuffer,
									'utf8' );
			}

		}

	},

	end : function () {

		log.ending( `${this.config.get('collection')}-${this.elementName} has been built` );

	}

});