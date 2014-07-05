(function(w, d) {

  d.addEventListener( 'DOMContentLoaded', function(e) {
    var sprintHolder = d.getElementById( 'sprintHolder' ),
        sprintClick = Rx.Observable.fromEvent( sprintHolder, 'click' )
        .map( function(ev) {
          var sprint = sprintHolder.appendChild( d.createElement( 'div' ) );

          sprint.className = 'sprint';
          sprint.style.top = Math.floor(ev.clientY / 10) * 10;
          sprint.style.left = Math.floor(ev.clientX / 10) * 10;

          return sprint;
        })
        .subscribe( function(ev) {
          //
        } );
  } );

})(window, document);