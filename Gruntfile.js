
var path = require('path');
var fs = require('fs');

module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      grunt: {files: ['Gruntfile.js']},
      jade: {
        files: 'modules/**/*.jade',
        tasks: ['jade']
      },
      concat: {
        files: 'modules/**/js/*.js',
        tasks: ['concat', 'uglify']
      }
    },
    jade: {
      options: {
        pretty: true,
      },
      files: {
        src: ['modules/**/*.jade'],
        dest: './public',
        expand: true,
        ext: '.html'
      }
    },
    copy: {
      files: {
        src: ['modules/**/js/*.js'],
        dest: './public',
        expand: true
      }
    },
    concat: {
      options: {
        //separator: ';'+ grunt.util.linefeed,
        banner: "'use strict';\n",
        process: function(src, filepath) {
          return src
            .replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      files: {
        src: ['modules/**/js/*.module.js', 'modules/**/js/*.js'],
        dest: './public/bundle.js'
      },
    },
    uglify: {
      files: {
        src: 'public/bundle.js',
        dest: 'public/bundle.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade', 'concat', 'watch']);
  grunt.registerTask('build', ['default', 'copy']);
}