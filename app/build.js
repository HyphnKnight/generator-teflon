const
	generators	= require( 'yeoman-generator' ),
	path		= require( 'path' ),
	jade		= require( 'jade' ),
	prompter	= require( `${global.teflon.bin}/prompter.js` ),
	fs			= require( 'fs-extra-promise' ),
	log			= require( 'log' );

global.root	= process.cwd();
global.source = `${global.root}/source`;
global.bin = `${global.root}/bin`;
global.teflon = {
	root : __dirname,
	bin : `${__dirname}/bin`,
	imports : `${__dirname}/imports`
};

module.exports = generators.Base.extend({

	initializing : {

		initiated : function () {

			log.starting( 'teflon' );
			log.creating( '.yo-rc.json' );

			this.config.save();

		}

	},

	prompting : {

		projectName		: prompter( 'input',
									'projectName',
									'What is your project\'s name?',
									'' ),

		description		: prompter( 'input',
									'description',
									'Can you give me a brief description of your project?' ),

		version			: prompter( 'input',
									'version',
									'What version of your project are you building?',
									'0.0.0' ),

		keywords		: prompter( 'array',
									'keywords',
									'What are some keywords that you associate with your new project?' ),

		license			: prompter( 'input',
									'license',
									'What license are you using with your project?',
									'MIT' ),

		author			: prompter( 'input',
									'author',
									'What is the name of the person or organization that is authoring this project?' )

	},

	writing : {

		createStartingContent : function () {

			fs.mkdirSync( `${global.source}/elements/core` );
			fs.mkdirSync( `${global.source}/media/images` );
			fs.mkdirSync( `${global.source}/media/fonts` );

			fs.copySync( './imports' , `${global.source}/imports` );
			fs.copySync( './bin' , `${global.root}/bin` );

			this.composeWith( 'teflon:add-page', { options: {} , args : [ 'index' ] } );

		},

		createPackageJSON : function () {

			let npmPackage = {
				main: 'bin/build.js',
				scripts: {
					start: 'node bin/build.js',
					dev: 'node bin/test.js && node bin/build.js --s --d --w',
					build: 'node bin/test.js && node bin/build.js --c',
					test: 'node bin/test.js'
				},
				dependencies: {}
			};

			npmPackage.dependencies['autoprefixer'] = '^6.1.2';
			npmPackage.dependencies['babel-core'] = '^6.3.13';
			npmPackage.dependencies['babel-preset-es2015'] = '^6.3.13';
			npmPackage.dependencies['csscomb'] = '^3.1.8';
			npmPackage.dependencies['cssnano'] = '^3.3.2';
			npmPackage.dependencies['express'] = '^4.13.3';
			npmPackage.dependencies['fs-extra-promise'] = '^0.3.1';
			npmPackage.dependencies['glob'] = '^6.0.1';
			npmPackage.dependencies['html-minifier'] = '^1.1.1';
			npmPackage.dependencies['imagemin'] = '^4.0.0';
			npmPackage.dependencies['jade'] = '^1.11.0';
			npmPackage.dependencies['jshint'] = '^2.8.0';
			npmPackage.dependencies['log'] = 'github:hyphnknight/log';
			npmPackage.dependencies['node-sass'] = '^3.4.2';
			npmPackage.dependencies['node-watch'] = '^0.3.5';
			npmPackage.dependencies['postcss'] = '^5.0.12';
			npmPackage.dependencies['rsvp'] = '^3.1.0';
			npmPackage.dependencies['uglify-js'] = '^2.6.1';
			npmPackage.dependencies['underscore'] = '^1.8.3';
			npmPackage.dependencies['vulcanize'] = '^1.14.0';

			npmPackage.name = this.config.get( 'name' );
			npmPackage.version = this.config.get( 'version' );
			npmPackage.description = this.config.get( 'description' );
			npmPackage.author = this.config.get( 'author' );
			npmPackage.keywords = this.config.get( 'keywords' );
			npmPackage.license = this.config.get( 'license' );

			fs.writeFileSync(`${global.root}/package.json`, JSON.stringify(npmPackage) , 'utf8' );

		}

	},

	install : {

		node : function () {

			log.runningTask( 'npm install' , 'bash' , global.root );

			exec( 'npm install' , ( error , stdout , stderr ) => {

				if ( error ) {
					log.error( 'npm install failed' , error );
					process.exit(1);
				}

			} );

		}

	},

	end : function () {

		log.ending( 'teflon has finished building' );

	}

});