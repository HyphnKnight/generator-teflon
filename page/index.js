const
  yeo = require( 'yeoman-generator' ),
  path    = require( 'path' ),
  jade    = require( 'jade' ).render,
  _     = require( 'underscore' ),
  prompter  = require( `${__dirname}/../bin/prompter.js` ),
  fs      = require( 'fs-extra-promise' ),
  log     = require( 'log' ),

  createVar = ( name , value ) => `-var ${name} = "${value}";\n`,

  createCollectionImports = elements => _
    .chain( elements )
    .map( element => { return element.split(' | '); } )
    .groupBy( element => { return element[0]; } )
    .map( ( elements , collection ) => {
      return createCollectionImport( collection , _.map( elements , element => { return element[1]; } ) );
    } )
    .value()
    .join('\n'),

  createCollectionImport = ( collection , elements ) => `+htmlImports( \'${collection}\' , [ \'${elements.join('\' , \'')}\' ] )`,

  createFavicon = url => `link(rel="icon" href='${url}' type="image/x-icon")`,

  createKeywords = keywords => `meta(name='keywords' content='${keywords}')`,

  createFacebook = ( type , image , url ) => `meta(property='og:type' content='${type}')\n\t\tmeta(property='og:description' content='#{description}')\n\t\tmeta(property='og:image' content='${image}')\n\t\tmeta(property='og:url' content='${url}')\n\t\tmeta(property='og:site_name' content='#{title}')`,

  getElementList = source => _
    .chain( fs.readdirSync( `${source}/elements` , 'utf8' ) )
    .filter( collection => { return collection.search('.DS_Store') === -1; } )
    .map( collection => {
      return _.chain( fs.readdirSync( `${source}/elements/${collection}` ) )
        .filter( element => { return element.search('.DS_Store') === -1; } )
        .map( element => {
          return `${collection} | ${element}`;
        })
        .value();
    } )
    .flatten()
    .value(),

  buildPage = ( src , type , title , description , author , favicon , facebook , keywords , elements ) =>
  `${createVar( 'title' , title )}${createVar( 'description' , description )}${createVar( 'author' , author )}\n` +
    (type === 'html' ?
     'include ./../app/imports/jade/_config.jade\ninclude ./../app/imports/jade/_mixin.jade\n\n' :
     'include ./imports/jade/_config.jade\ninclude ./imports/jade/_mixin.jade\n\n') +
  `${src}
    ${ !!favicon ? createFavicon(favicon) : '' }
    ${ !!facebook ? createFacebook( facebook.type , facebook.image , facebook.url ) : '' }
    ${ !!keywords ? createKeywords(keywords) : '' }
    ${ !!elements ? createCollectionImports(elements) : '' }
  body`;

module.exports = yeo.Base.extend({

  constructor : function ( ) {

    yeo.Base.apply(this, arguments);

    this.argument('pageName', { type: String, required: true });

  },

  initializing : {

    initiated : function ( ) {

      log.starting( `Building the ${this.pageName} page` );

    }

  },

  prompting : {

    templateType  : prompter( 'list',
                  'templateType',
                  'template language :',
                  'jade',
                  [ 'html' , 'jade' ] ),

    description   : prompter( 'input',
                  'description',
                  'page description :',
                  '' ),

    author      : prompter( 'input',
                  'author',
                  'page author :',
                  '' ),

    favicon     : prompter( 'input',
                  'favicon',
                  'favicon :',
                  '' ),

    facebook_type : prompter( 'input',
                  'facebook_type',
                  'open graph type :',
                  '' ),

    facebook_image  : prompter( 'input',
                  'facebook_image',
                  'open graph image :',
                  '' ),

    facebook_url  : prompter( 'input',
                  'facebook_url',
                  'open graph url :',
                  '' ),

    elements    : prompter( 'checkbox',
                  'elements',
                  'elements :',
                  ['core | core-polymer','core | core-scripts','core | core-styles'],
                  getElementList(`${process.cwd()}/source`) ),
  },

  writing : {

    indexFile : function () {

      const buffer = buildPage( fs.readFileSync( `${__dirname}/index.jade` ),
                                this.config.get( 'templateType' ),
                                this.pageName,
                                this.config.get('description') === '' ? null : this.config.get('description'),
                                this.config.get('author') === '' ? null : this.config.get('author'),
                                this.config.get('favicon') === '' ? null : this.config.get('favicon'),
                                this.config.get('facebook_type') !== '' || this.config.get('facebook_image') !== '' || this.config.get('facebook_url') !== '' ?
                                  { type : this.config.get('facebook_type'),
                                    image : this.config.get('facebook_image'),
                                    url : this.config.get('facebook_url') } : null,
                                this.config.get('keywords'),
                                this.config.get('elements') );

      console.log(buffer);

      if ( this.config.get( 'templateType' ) === 'html' ) {

        log.creating( `${process.cwd()}/source/${this.pageName}.html` );

        fs.writeFileSync( `${process.cwd()}/source/${this.pageName}.html` , jade (buffer , { pretty : true , filename : __filename } ) );

      } else {

        log.creating( `${process.cwd()}/source/${this.pageName}.jade` );

        fs.writeFileSync( `${process.cwd()}/source/${this.pageName}.jade` , buffer );

      }

    }

  },

  end : function () {

    log.ending( `The ${this.pageName} page has been built` );

  }

});