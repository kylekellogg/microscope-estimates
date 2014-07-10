module.exports = function( grunt ) {
  grunt.initConfig( {
    bower_concat: {
      all: {
        dest: 'js/dependencies.js',
        mainFiles: {
          'rxjs': '../dist/rx.all.js',
          'rxjs-html': '../dist/rx.dom.js'
        },
        exclude: [
          'uikit'
        ]
      }
    }
  } );

  grunt.loadNpmTasks( 'grunt-bower-concat' );

  grunt.registerTask( 'default', [ 'bower_concat' ] );
}
