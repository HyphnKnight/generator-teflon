const
	generators	= require( 'yeoman-generator' ),
	path		= require( 'path' ),
	jade		= require( 'jade' ).render,
	fs			= require( 'fs-extra-promise' ),
	prompter	= require( `${__dirname}/../bin/prompter.js` ),
	log			= require( 'log' );

module.exports = generators.Base.extend({

	initializing : {

		initiated : function () {

			log.starting( 'Creating Element' );

		}

	},

	prompting : {

		element			: prompter( 'input',
									'element',
									'Element Name :',
									'' ),

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

			fs.mkdirpSync( `${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.config.get('element')}` );

		},

		createFiles : function () {

			const
				templateBuffer = `dom-module#${this.config.get('collection')}-${this.config.get('element')}\n\n\ttemplate\n\n\t\tlink(rel='stylesheet' type="text/css" href='style.css')\n\n\tscript(src='script.js')`,
				scriptBuffer = `Polymer({\n\n\tis: "${this.config.get('collection')}-${this.config.get('element')}",\n\n\tproperties: {\n\n\t},\n\n\tready : function ( ) {\n\n\t}\n\n});`;

			fs.writeFileSync(	`${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.config.get('element')}/index.${this.config.get('templateType')}`,
								this.config.get('templateType') === 'html' ? jade( templateBuffer , { pretty : true , filename : __filename } ) : templateBuffer,
								'utf8' );

			if ( this.config.get('scriptLanguage') !== 'none' ) {
				fs.writeFileSync(	`${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.config.get('element')}/script.js`,
									scriptBuffer,
									'utf8' );
			}

			if ( this.config.get('styleLanguage') !== 'none' ) {
				fs.writeFileSync(	`${process.cwd()}/source/elements/${this.config.get('collection')}/${this.config.get('collection')}-${this.config.get('element')}/style.${this.config.get('styleLanguage')}`,
									':root{}',
									'utf8' );
			}

		}

	},

	end : function () {

		log.ending( `${this.config.get('collection')}-${this.config.get('element')} has been built` );

	}

});