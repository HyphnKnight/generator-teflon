const
	generators	= require( 'yeoman-generator' ),
	path		= require( 'path' ),
	jade		= require( 'jade' ),
	fs			= require( 'fs-extra-promise' ),
	log			= require( 'log' );

module.exports = generators.Base.extend({

	initializing : {

		initiated : function () {

			log.starting( 'Creating Element' );

			generators.Base.apply(this, arguments);

			this.argument('element', { type: String, required: true });


		}

	},

	prompting : {

		collection		: prompter( 'input',
									'collection',
									'collection :',
									'' ),

		templateType	: prompter( 'list',
									'templateType',
									'template language :',
									'jade',
									[	'html',
										'jade' ] ),

		styleLanguage	: prompter( 'list',
									'styleLanguage',
									'style language :',
									'scss',
									[	'css',
										'scss',
										'sass',
										'none' ] ),

		scriptLanguage	: prompter( 'list',
									'scriptLanguage',
									'script language :',
									'scss',
									[	'js',
										'none' ] ),

	},

	writing : {

		directory : function () {

			fs.mkdirpSync( `${global.source}/elements/${this.config.collection}/${this.element}` );

		},

		createFiles : function () {

			const
				templateBuffer = `dom-module#${this.element}\n\n\ttemplate\n\n\t\tlink(rel='stylesheet' type="text/css" href='style.css')\n\n\tscript(src='script.js')`,
				scriptBuffer = `Polymer({\n\n\tis: "${this.element}",\n\n\tproperties: {\n\n\t},\n\n\tready : function ( ) {\n\n\t}\n\n});`;

			fs.writeFileSync(	`${global.source}/elements/${this.config.collection}/${this.element}/index.${this.config.templateType}`,
								this.config.templateType === 'jade' ? jade( templateBuffer ) : templateBuffer,
								'utf8' );

			if ( this.config.scriptLanguage !== 'none' ) {
				fs.writeFileSync(	`${global.source}/elements/${this.config.collection}/${this.element}/script.js`,
									scriptBuffer,
									'utf8' );
			}

			if ( this.config.styleLanguage !== 'none' ) {
				fs.writeFileSync(	`${global.source}/elements/${this.config.collection}/${this.element}/style.${this.config.styleLanguage}`,
									':root',
									'utf8' );
			}

		}

	}

	end : function () {

		log.ending( `${this.element} has been built` );

	}

});