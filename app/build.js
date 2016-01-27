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

			let package = {
				main: 'bin/build.js',
				scripts: {
					start: 'node bin/build.js',
					dev: 'node bin/test.js && node bin/build.js --s --d --w',
					build: 'node bin/test.js && node bin/build.js --c',
					test: 'node bin/test.js'
				},
				dependencies: {}
			};

			package.dependencies['autoprefixer'] = '^6.1.2';
			package.dependencies['babel-core'] = '^6.3.13';
			package.dependencies['babel-preset-es2015'] = '^6.3.13';
			package.dependencies['csscomb'] = '^3.1.8';
			package.dependencies['cssnano'] = '^3.3.2';
			package.dependencies['express'] = '^4.13.3';
			package.dependencies['fs-extra-promise'] = '^0.3.1';
			package.dependencies['glob'] = '^6.0.1';
			package.dependencies['html-minifier'] = '^1.1.1';
			package.dependencies['imagemin'] = '^4.0.0';
			package.dependencies['jade'] = '^1.11.0';
			package.dependencies['jshint'] = '^2.8.0';
			package.dependencies['log'] = 'github:hyphnknight/log';
			package.dependencies['node-sass'] = '^3.4.2';
			package.dependencies['node-watch'] = '^0.3.5';
			package.dependencies['postcss'] = '^5.0.12';
			package.dependencies['rsvp'] = '^3.1.0';
			package.dependencies['uglify-js'] = '^2.6.1';
			package.dependencies['underscore'] = '^1.8.3';
			package.dependencies['vulcanize'] = '^1.14.0';

			package.name = this.config.get( 'name' );
			package.version = this.config.get( 'version' );
			package.description = this.config.get( 'description' );
			package.author = this.config.get( 'author' );
			package.keywords = this.config.get( 'keywords' );
			package.license = this.config.get( 'license' );

			fs.writeFileSync(`${global.root}/package.json`, JSON.stringify(package) , 'utf8' );

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