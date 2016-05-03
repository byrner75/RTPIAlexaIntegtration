module.exports = function (grunt) {
    
    grunt.initConfig({
        jshint: {
	    files: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
            ignore_warning: {
                options: {
                    '-W015': true,
                },
	       files: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
	       filter: 'isFile'
            }
        },
        uglify: {
           dynamic_mappings: {
              // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
              // runs and build the appropriate src-dest file mappings then, so you
              // don't need to update the Gruntfile when files are added or removed.
              files: [
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: 'app/',      // Src matches are relative to this path.
                  src: ['**/*.js'], // Actual pattern(s) to match.
                  dest: 'build/',   // Destination path prefix.
                  ext: '.min.js',   // Dest filepaths will have this extension.
                  extDot: 'first'   // Extensions in filenames begin after the first dot
                }
              ]
           }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/**/*.js']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'dist/RTPIAlexaIntegration.zip'
                },
                files: [
                    { expand: true, cwd: 'build/', src: ['*'], dest: '../', filter: 'isFile'} // includes files in path
                ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('default', ['mochaTest','jshint','uglify']);
    grunt.registerTask('dist', ['uglify','compress']);
};