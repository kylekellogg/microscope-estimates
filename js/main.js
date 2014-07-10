(function(w, d) {

  function onDOMContentLoaded() {
    var codemirror = document.querySelector( '.CodeMirror' ).CodeMirror,
        // emitter = new Emitter(),
        markdownTextarea = document.getElementById( 'markdown-textarea' ),
        $markdownTextarea = $( markdownTextarea );

    var markdownInput = Rx.Observable.fromEvent( markdownTextarea, 'keyup' )
        .map( function( ev ) {
          return ev.target.value;
        } )
        .throttle( 500 )
        .distinctUntilChanged()
        .map( function( text ) {
          var markup = marked( text )
          return renderContent( markup );
        } )
        .subscribe( function( doc ) {
          console.log( doc );
          //  TODO: Recursively loop through doc's lists and their items rendering as you go
        } );

    codemirror.on( 'change', function(cm) {
      markdownTextarea.value = cm.getDoc().getValue();
      $markdownTextarea.keyup();
    } );
  }

  function ListItem( content ) {
    this.content = content;
    this.list = null;

    return this;
  }

  function List( ordered ) {
    this.items = [];
    this.ordered = ordered;
    this.parentList = null;

    return this;
  }

  List.prototype.add = function( item ) {
    if ( !item ) {
      return;
    }

    if ( item.hasOwnProperty( 'length' ) ) {
      for ( var i = 0, l = item.length; i < l; i++ ) {
        item[i].list = this;
        this.items.push( item[i] );
      }
    } else {
      item.list = this;
      this.items.push( item );
    }
  };

  function Doc() {
    this.lists = [];

    return this;
  }

  Doc.prototype.add = function( list ) {
    if ( !list ) {
      return;
    }

    this.lists.push( list );
  };

  function createListWithParent( doc, parent, ordered, skipAdd ) {
    var l = new List( ordered );
    l.parentList = parent;

    if ( !skipAdd ) {
      doc.add( l );
    }

    return l;
  }

  function addListItemsToList( input, theDoc, theList ) {
    var listRegex = /^<([ou])l>$/i,
        liRegex = /^<li>(.*)(?=<\/li>)<\/li>$/i,
        sublistRegex = /^<li>(.*)(?=<([uo])l>)<([uo])l>$/i,
        endListRegex = /^<\/([ou])l>$/i,
        lines = typeof(input) === 'string' ? input.split( /[\r\n]/ ) : input,
        listMode = false,
        ordered = false,
        doc = theDoc || new Doc(),
        list = theList || null;

    for ( var i = 0, l = lines.length; i < l; i++ ) {
      var val = lines[i];

      if ( val.length <= 0 ) {
        continue;
      }

      if ( list ) {
        if ( endListRegex.test( val ) ) {
          list = list.parentList || null;
        } else if ( liRegex.test( val ) ) {
          list.add( new ListItem( val.match( liRegex )[1], ordered ) );
        } else if ( sublistRegex.test( val ) ) {
          list.add( new ListItem( val.match( sublistRegex )[1], ordered ) );

          list = createListWithParent( doc, list, val.match( sublistRegex )[3] === 'o', true );
          list.parentList.add( list );

          for ( var j = i+1; j < l; j++ ) {
            var nval = lines[j];

            if ( endListRegex.test( nval ) ) {
              var items = addListItemsToList( lines.slice( i+1, j ), theDoc, list );
              list.add( items );
              list = list.parentList || null;
              i = j;
              break;
            }
          }
        }
      } else if ( listRegex.test( val ) ) {
        list = createListWithParent( doc, list, val.match( listRegex )[1] === 'o' );
      } else if ( sublistRegex.test( val ) ) {
        list = createListWithParent( doc, list, val.match( sublistRegex )[3] === 'o' );
      }
    }

    return theList ? null : doc;
  }

  function renderContent( html ) {
    return addListItemsToList( html, null, null );
  }

  d.addEventListener( 'DOMContentLoaded', onDOMContentLoaded );

})(window, document);