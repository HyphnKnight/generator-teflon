const
	generators	= require( 'yeoman-generator' ),
	path		= require( 'path' ),
	prompter	= require( './../bin/prompter.js' ),
	fs			= require( 'fs-extra-promise' ),
	log			= require( 'log' );

function createVar ( name , value ) {
	return `-var ${name} = ${value}\n`;
}

function createCollectionImports ( elements ) {
	return _.chain( elements )
		.map( element => { return element.split(' | '); } )
		.groupBy( element => { return element[0]; } )
		.map( ( elements , collection ) => {
			return createCollectionImport( collection , _.map( elements , element => { return element[1]; } ) );
		} )
		.value().join('\n');
}

function createCollectionImport ( collection , elements ) {
	return  `\t\t+htmlImports( \'${collection}\' , [ \'${elements.join('\' , \'')}\' ] )`;
}

function createFavicon ( url ) {
	return `\t\tlink(rel="icon" href='#{${url}}' type="image/x-icon")`
}

function createKeywords ( keywords ) {
	return `\t\tmeta(name='keywords' content='#{${keywords}}')`
}

function createFacebook ( type , image , url ) {

	return	`\t\tmeta(property='og:type' content='#{${type}}')\n` +
			`\t\tmeta(property='og:description' content='#{description}')\n` +
			`\t\tmeta(property='og:image' content='#{${image}}')\n` +
			`\t\tmeta(property='og:url' content='#{${url}}')\n` +
			`\t\tmeta(property='og:site_name' content='#{title}')\n`;

}

function buildPage ( src , title , description , author , favicon , facebook , keywords , elements ) {

	return	`${createVar( 'title' , title )}
			${createVar( 'description' , description )}
			${createVar( 'author' , author )}
			${src}
			${ !!favicon ? createFavicon(favicon) : '' }
			${ !!facebook ? createFacebook( facebook.type , facebook.image , facebook.url ) : '' }
			${ !!keywords ? createKeywords(keywords) : '' }
			${ !!elements ? createCollectionImports(elements) : '' }
			\tbody`;

}

function getElementList ( source ) {

	return _.chain( fs.readdirSync( source , 'utf8' ) )
		.map( collection => {
			return _.map( fs.readdirSync( collection ) , element => {
				return `${collection} | ${element}`;
			});
		} )
		.flatten()
		.value();

}

module.exports = generators.Base.extend({

	constructor : function ( ) {

		generators.Base.apply(this, arguments);

		this.argument('pageName', { type: String, required: true });

	},

	initializing : {

		initiated : function ( ) {

			log.runningTask( 'add-page', 'Teflon' );

		}

	},

	prompting : {

		templateType	: prompter( 'list',
									'templateType',
									'template language :',
									'jade',
									[ 'html' , 'jade' ] ),

		description		: prompter( 'input',
									'description',
									'page description :',
									'' ),

		author			: prompter( 'input',
									'author',
									'page author :',
									'' ),

		favicon			: prompter( 'input',
									'favicon',
									'favicon :',
									'' ),

		facebook_type	: prompter( 'input',
									'facebook_type',
									'open graph type :',
									'' ),

		facebook_image	: prompter( 'input',
									'facebook_image',
									'open graph image :',
									'' ),

		facebook_url	: prompter( 'input',
									'facebook_url',
									'open graph url :',
									'' ),

		elements		: prompter( 'checkbox',
									'elements',
									'template language :',
									'',
									getElementList(global.source) ),
	}

	writing : {

		indexFile : function () {

			const buffer = buildPage(	fs.readFileSync( './index.jade' ),
										this.pageName,
										this.description === '' ? null : this.description,
										this.author === '' ? null : this.author,
										this.favicon === '' ? null : this.favicon,
										this.facebook_type !== '' || this.facebook_image !== '' || facebook_url !== '' ?
											{	type : this.facebook_type,
												image : this.facebook_image,
												url : this.facebook_url } : null,
										this.elements );

			if ( this.config.get( 'templateType' ) === 'html' ) {
				fs.writeFileSync( jade(buffer) );
			} else {
				fs.writeFileSync( buffer );
			}

		}

	}

});