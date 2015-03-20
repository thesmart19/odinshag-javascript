module.exports = function (grunt) {
    /* Project configuration */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            javascripts: {
                files: {
                    /* jQuery core + plugins + User scripts */
                    'build/bitrix/js/cosmo/production.js': [
                        'source/bitrix/js/cosmo/1-01-jquery.js',
                        'source/bitrix/js/cosmo/1-02-jquery-ui-1.10.4.custom.min.js',
                        'source/bitrix/js/cosmo/1-03-jquery-ui.datepicker-ru.js',
                        'source/bitrix/js/cosmo/1-04-jquery.cookie.js',
                        'source/bitrix/js/cosmo/1-05-jquery.custom-scrollbar.min.js',
                        'source/bitrix/js/cosmo/1-06-jquery.maskedinput.js',
                        'source/bitrix/js/cosmo/1-07-jquery.scrollTo.js',
                        'source/bitrix/js/cosmo/1-08-jquery.fileupload.js',
                        'source/bitrix/js/cosmo/1-09-jquery.json.min.js',
                        'source/bitrix/js/cosmo/1-10-json.js',
                        'source/bitrix/js/cosmo/1-11-jquery.zoom.min.js',
                        /*'source/bitrix/js/cosmo/1-12-zero-clipboard.min.js', --- скрипт временно исключен из проекта */
                        'source/bitrix/js/cosmo/2-01-script.js'
                    ],
                    /* main template script */
                    'build/bitrix/templates/cosmo/js/script.js': ['source/bitrix/templates/cosmo/js/script.js'],
                    /* Условия доставки */
                    'build/services/delivery/js/script.js': ['source/services/delivery/js/script.js'],
                    /* Вакансии */
                    'build/company/vacancy/js/cv-form.js': ['source/company/vacancy/js/cv-form.js'],
                    'build/company/vacancy/js/script.js': ['source/company/vacancy/js/script.js'],
                    /* Возврат товара */
                    'build/services/moneyback/js/script.js': ['source/services/moneyback/js/script.js'],
                    /* Шаблон страницы товара */
                    'build/bitrix/templates/.default/components/os/catalog.element_3.0/cosmo/script.js': ['source/bitrix/templates/.default/components/os/catalog.element_3.0/cosmo/script.js'],
                    /* Форма отзывов */
                    'build/bitrix/templates/.default/components/os/review_form/cosmo/script.js': ['source/bitrix/templates/.default/components/os/review_form/cosmo/script.js'],
                    /* Лендинг объявлений */
                    'build/add-ads/js/script.js': [
                        'source/bitrix/js/cosmo/1-01-jquery.js',
                        'source/bitrix/js/cosmo/1-06-jquery.maskedinput.js',
                        'source/add-ads/js/script.js'
                    ],
                    /* Лендинг про ледоступы */
                    'build/lending-ledostupi/script.js': [
                        'source/bitrix/js/cosmo/1-01-jquery.js',
                        'source/bitrix/js/cosmo/1-06-jquery.maskedinput.js',
                        'source/lending-ledostupi/script.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                /* prevent changes to your variable and function names */
                mangle: false,
                /* source map file will be generated in the same directory */
                sourceMap: true
            },
            javascripts: {
                files: {
                    /* jQuery core + plugins + User scripts */
                    'build/bitrix/js/cosmo/production.min.js': ['build/bitrix/js/cosmo/production.js'],
                    /* main template script */
                    'build/bitrix/templates/cosmo/js/script.min.js': ['build/bitrix/templates/cosmo/js/script.js'],
                    /* Условия доставки */
                    'build/services/delivery/js/script.js': ['build/services/delivery/js/script.js'],
                    /* Вакансии */
                    'build/company/vacancy/js/cv-form.js': ['build/company/vacancy/js/cv-form.js'],
                    'build/company/vacancy/js/script.js': ['build/company/vacancy/js/script.js'],
                    /* Возврат товара */
                    'build/services/moneyback/js/script.js': ['build/services/moneyback/js/script.js'],
                    /* Шаблон страницы товара */
                    'build/bitrix/templates/.default/components/os/catalog.element_3.0/cosmo/script.js': ['build/bitrix/templates/.default/components/os/catalog.element_3.0/cosmo/script.js'],
                    /* Форма отзывов */
                    'build/bitrix/templates/.default/components/os/review_form/cosmo/script.js': ['build/bitrix/templates/.default/components/os/review_form/cosmo/script.js'],
                    /* Лендинг объявлений */
                    'build/add-ads/js/script.js': 'build/add-ads/js/script.js',
                    /* Лендинг про ледоступы */
                    'build/lending-ledostupi/script.js': 'build/lending-ledostupi/script.js'
                }
            }
        },
        copy: {
            main: {
                files: [
                    /* update jQuery core */
                    {
                        src: 'source/jquery/jquery-1.11.2.js',
                        dest: 'source/bitrix/js/cosmo/1-01-jquery.js'
                    },
                    /* update jQuery JSON plugin */
                    {
                        src: 'source/plugins/jquery-json/dist/jquery.json.min.js',
                        dest: 'source/bitrix/js/cosmo/1-09-jquery.json.min.js'
                    },
                    /* update JSON-js plugin */
                    {                        
                        src: 'source/plugins/json-js/json2.js',
                        dest: 'source/bitrix/js/cosmo/1-10-json.js'
                    }
                ]
            }
        }
    });
    /* Load the plugin that provides the "uglify" task */
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    /* Task(s) */
    grunt.registerTask('default', ['concat', 'uglify']);
    /* copy - update jquery and plugins */
    grunt.registerTask('update', ['copy']);
};