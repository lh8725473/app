module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      'default': {
        files: {
          'src/admin/admin.css': 'src/admin/admin.less',
          'src/app/app.css': 'src/app/app.less'
        },
        options: {
          modifyVars: {
            theme: 'default'
          }
        }
      },
      'dark': {
        files: {
          'src/admin/admin.css': 'src/admin/admin.less',
          'src/app/app.css': 'src/app/app.less'
        },
        options: {
          modifyVars: {
            theme: 'dark'
          }
        }
      }
    },
    watch: {
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:default'],
        options: {
          atBegin: true
        }
      }
    },
    copy: {
      html: {
        files: {
          'production/admin.html': 'admin.html',
          'production/index.html': 'index.html'
        }
      },
      images: {
        files: [{
          expand: true,
          cwd: './',
          src: ['images/**'],
          dest: 'production/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: './bower_components/bootstrap/dist/',
          src: ['fonts/**'],
          dest: 'production/css/'
        }]
      }
    },
    clean: {
      build: ['build/'],
      production: ['production/']
    },
    useminPrepare: {
      html: ['production/admin.html', 'production/index.html'],
      options: {
        root: './',
        dest: 'production/'
      }
    },
    filerev: {
      production: {
        src: 'production/**/*.{css,js}'
      }
    },
    usemin: {
      html: ['production/admin.html', 'production/index.html']
    },
    inline_angular_templates: {
      production: {
        files: {
          'production/admin.html': ['src/admin/**/*.html'],
          'production/index.html': ['src/app/**/*.html']
        }
      },
      options: {
        unescape: {
          '&apos;': '\''
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-filerev')
  grunt.loadNpmTasks('grunt-inline-angular-templates')

  grunt.registerTask('build', [
    'clean',
    'less',
    'copy',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'inline_angular_templates'
  ])
}