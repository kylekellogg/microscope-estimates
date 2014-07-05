window.sprint = function( opts ) {
  function mergeDefaultSprintOptions( o ) {
    var defaults = {
      el: null,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      color: 'rgb( 80, 80, 80 )'
    }

    if ( !o ) {
      return defaults;
    }

    var ret = {};
    for ( var att in defaults ) {
      ret[att] = defaults[att];
    }
    for ( var att in o ) {
      ret[att] = o[att];
    }

    return ret;
  }

  opts = mergeDefaultSprintOptions( opts );
  for ( var att in opts ) {
    this[att] = opts[att];
  }

  this.x = Math.floor( this.x / this.width ) * this.width;
  this.y = Math.floor( this.y / this.height ) * this.height;

  if ( !this.el ) {
    var sprintHolder = document.getElementById( 'sprintHolder' );
    this.el = sprintHolder.appendChild( document.createElement( 'div' ) );
    this.el.className = 'sprint';
  }

  this.el.style.width = this.width;
  this.el.style.height = this.height;
  this.el.style.left = this.x;
  this.el.style.top = this.y;
  this.el.style.backgroundColor = this.color;

  var self = this;
  var clickStream = Rx.Observable.fromEvent( this.el, 'click' )
      .subscribe( function( ev ) {
        var r = Math.round( Math.random() * 255 ),
            g = Math.round( Math.random() * 255 ),
            b = Math.round( Math.random() * 255 );
        self.color = 'rgb( ' + r + ', ' + g + ', ' + b + ' )';
        self.el.style.backgroundColor = self.color;
      } );

  return this;
};
