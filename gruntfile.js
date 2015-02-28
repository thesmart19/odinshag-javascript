module.exports = function (grunt) {
    /* Project configuration */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            basic_and_extras: {
                files: {
                    'build/bitrix/js/cosmo/production.js': [
                        'source/bitrix/js/cosmo/1-01-jquery-1.9.1.min.js',
                        'source/bitrix/js/cosmo/1-02-jquery-ui-1.10.4.custom.min.js',
                        'source/bitrix/js/cosmo/1-03-jquery-ui.datepicker-ru.js',
                        'source/bitrix/js/cosmo/1-04-jquery.cookie.js',
                        'source/bitrix/js/cosmo/1-05-jquery.custom-scrollbar.min.js',
                        'source/bitrix/js/cosmo/1-06-jquery.maskedinput.js',
                        'source/bitrix/js/cosmo/1-07-jquery.scrollTo.js',
                        'source/bitrix/js/cosmo/1-08-jquery.fileupload.js',
                        'source/bitrix/js/cosmo/1-09-jquery.json-2.4.min.js',
                        'source/bitrix/js/cosmo/1-10-jquery.zoom.min.js',
                        'source/bitrix/js/cosmo/1-11-zero-clipboard.min.js',
                        'source/bitrix/js/cosmo/2-01-script.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false, /* prevent changes to your variable and function names */
                sourceMap: true /* source map file will be generated in the same directory */
            },
            my_target: {
                files: {
                    'build/bitrix/js/cosmo/production.min.js': ['build/bitrix/js/cosmo/production.js']
                }
            }
        }
    });
    /* Load the plugin that provides the "uglify" task */
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Default task(s) */
    grunt.registerTask('default', ['concat', 'uglify']);
};