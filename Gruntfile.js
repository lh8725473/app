module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            'default': {
                files: {
                    'build/default/app.css': 'src/app/app.less'
                },
                options: {
                    modifyVars: {
                        theme: 'default'
                    }
                }
            },
            'dark': {
                files: {
                    'build/dark/app.css': 'src/app/app.less'
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
                    'production/index.html': 'index.html'
                }
            }
        },
        clean: {
            build: ['build/'],
            production: ['production/']
        },
        useminPrepare: {
            html: 'production/index.html',
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
            html: 'production/index.html'
        },
        inline_angular_templates: {
            production: {
                files: {
                    'production/index.html': ['src/**/*.html']
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