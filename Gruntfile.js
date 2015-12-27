
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
/*
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy:js', /*'concat:js', 'uglify:bundle']);
*/

  grunt.event.on('watch', function(action, filepath, target) {
      //change the source and destination in the uglify task at run time so that it affects the changed file only
      console.log('js', grunt.config('concat'))
      //grunt.config('uglify.all.src', filepath);
      //grunt.config('uglify.all.dest', destFilePath);
  });
  
  grunt.registerTask('app', 'prepare modules', function(){
    grunt.file.expand('modules/*').forEach(function(dir){
      var dirName = dir.substr(dir.lastIndexOf('/')+1);
      var copy =  grunt.config.get('copy') || {};
      var jade = grunt.config.get('jade') || {};
      
      var filesToCopy = grunt.file.expand(dir + '/public/*').map(function(file){
        return {
          dest:'public/' + file.replace(/public\//, ''),
          src: file
        };
      })

      var filesToJade = grunt.file.expand(dir + '/src/views/**/*.jade').map(function(file){
        var fileObj = path.parse(file);
        return {
          dest: fileObj.dir.replace(/src/, 'public') + '/' + fileObj.name + '.html',
          src: file
        }
      })

      //jade[dirName] = {files: filesToJade};
      copy[dirName] = {files: filesToCopy};

      grunt.config.set('copy', copy);
      grunt.config.set('jade', jade);
    })
  })

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade', 'concat', 'watch']);
  grunt.registerTask('build', ['default', 'copy']);
}