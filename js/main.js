(function(w, d) {

  d.addEventListener( 'DOMContentLoaded', function(e) {
    var sprintHolder = d.getElementById( 'sprintHolder' ),
        sprintHolderClick = Rx.Observable.fromEvent( sprintHolder, 'click' )
        .filter( function(ev) {
          return ev.target.id === 'sprintHolder';
        } )
        .subscribe( function(ev) {
          var sprint = new w.sprint( {
            x: ev.clientX,
            y: ev.clientY
          } );
        } );
  } );

})(window, document);