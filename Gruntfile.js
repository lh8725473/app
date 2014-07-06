module.exports = function (grunt) {
  grunt.initConfig({
    less: {
      compile: {
        files: {
          'build/default/app.css': 'src/app.less'
        }
      }
    },
    watch: {
      less: {
        files: ['src/**/*.less'],
        tasks: ['less'],
        options: {
          atBegin: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
}