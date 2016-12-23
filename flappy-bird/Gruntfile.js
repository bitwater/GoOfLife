/*jshint globalstrict: true*/
'use strict';

var PORTS = {
  express: 9400 || process.env.PORT,
  livereload: 31452
};

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var fs = require('fs');

  grunt.initConfig({

    nodemon: {
      debug: {
        script: 'server.js',
        options: {
          watch: [
            'server.js'
          ],
          nodeArgs: ['--debug'],
          env: {
            LIVERELOAD_PORT: PORTS.livereload,
            PORT: PORTS.express
          },
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });
            nodemon.on('restart', function() {
              setTimeout(function() {
                fs.writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },

    concurrent: {
      server: {
        tasks: [
          'nodemon',
          'watch'
        ],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      }
    },

    // Watching changes
    watch: {
      html: {
        files: ['app/*.html'],
        tasks: ['build:html']
      },
      styles: {
        files: ['app/styles/*.less'],
        tasks: ['build:styles']
      },
      images: {
        files: ['app/images/*'],
        tasks: ['build:images']
      },
      sounds: {
        files: ['app/sounds/*'],
        tasks: ['build:sounds']
      },
      scripts: {
        files: ['app/scripts/{,*/}*.js'],
        tasks: ['build:scripts']
      },
      livereload: {
        options: {
          livereload: PORTS.livereload
        },
        files: [
          'build/*.html',
          'build/styles/*.css',
          'build/images/*',
          'build/sounds/*',
          'build/scripts/{,*/}*.js'
        ]
      },
      server: {           // nodemon will write this file
        files: ['.rebooted'],
        tasks: ['jshint:server'],
        options: {
          livereload: true
        }
      }
    },

    // Cleaning
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['dist/*', '.tmp']
        }]
      },
      build: {
        files: [{
          dot: true,
          src: ['build/*']
        }]
      }
    },

    // lint
    jshint: {
      options: {
        indent: 2,
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      server: {
        src: ['server.js']
      },
      all: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js'
      ]
    },

    // recess
    recess: {
      options: {
        noOverqualifying: false,
        noUniversalSelectors: false
      },
      all: {
        src: ['app/styles/main.less']
      }
    },

    // browserify
    browserify: {
      scripts: {
        src: 'app/scripts/main.js',
        dest: 'build/scripts/main.js'
      }
    },

    // Transform less files
    less: {
      build: {
        files: [{
          expand: true,
          cwd: 'app/styles',
          src: 'main.less',
          dest: 'build/styles',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 5%', 'last 2 versions']
      },
      build: {
        files: [{
          expand: true,
          cwd: 'build/styles/',
          src: '*.css',
          dest: 'build/styles/'
        }]
      }
    },

    // Rename files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            'dist/scripts/{,*/}*.js',
            'dist/styles/*.css'
          ]
        }
      }
    },

    // Perform rewrites based on rev
    useminPrepare: {
      html: 'build/*.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/*.html'],
      css: ['dist/styles/*.css'],
      options: {
        assetsDirs: ['dist']
      }
    },

    // Image minification
    imagemin: {
      options: {
        cache: false
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'build/images',
          src: '*',
          dest: 'dist/images'
        }]
      }
    },

    // Copy files
    copy: {
      html: {
        files: [{
          expand: true,
          cwd: 'app',
          dest: 'build',
          src: ['*.html']
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: 'app',
          dest: 'build',
          src: [
            'images/*'
          ]
        }]
      },
      sounds: {
        files: [{
          expand: true,
          cwd: 'app',
          dest: 'build',
          src: [
            'sounds/*'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'build',
          dest: 'dist',
          src: [
            '*.html',
            'images/*',
            'sounds/*'
          ]
        }]
      }
    }

  });

  grunt.registerTask('serve', [
    'build',
    'concurrent:server'
  ]);

  grunt.registerTask('build', function(target) {
    switch (target) {
    case 'html':
      grunt.task.run('copy:html');
      break;
    case 'styles':
      grunt.task.run('recess', 'less:build', 'autoprefixer:build');
      break;
    case 'scripts':
      grunt.task.run('jshint', 'browserify:scripts');
      break;
    case 'images':
      grunt.task.run('copy:images');
      break;
    case 'sounds':
      grunt.task.run('copy:sounds');
      break;
    case 'server':
      grunt.task.run('jshint:server');
      break;
    case undefined:
      grunt.task.run(
        'clean:build',
        'build:html',
        'build:browserify',
        'build:scripts',
        'build:images',
        'build:sounds',
        'build:styles'
      );
      break;
    default:
      grunt.util.error('unknown target ' + target + ' for build');
    }
  });

  grunt.registerTask('dist', [
    'clean:dist',
    'build',
    'useminPrepare',
    'imagemin',
    'copy:dist',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'dist'
  ]);
};
