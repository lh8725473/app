module.exports = function (grunt) {
  grunt.initConfig({
    less: {
      compile: {
        files: {
          'build/index.css': 'src/index.less'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
}