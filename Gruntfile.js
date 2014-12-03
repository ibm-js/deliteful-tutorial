module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-amd-build');
    var outprop = 'amdoutput';
    var outdir = './build/';
    var tmpdir = './tmp/';
    var common = {
            options: { banner: '<%= ' + outprop + '.header%>' },
            src: '<%= ' + outprop + '.modules.abs %>',
            dest: outdir + '<%= ' + outprop + '.layerPath %>'
        };
    grunt.initConfig({
        amdloader: {
            baseUrl: 'bower_components',
            paths: { 'js': '../js' },
            config: {
                'ecma402/locales': [
                    'en-us',
                    'fr-fr',
                    'de-de',
                    'it-it',
                    'ko-kr',
                    'pt-br',
                    'es-us',
                    'zh-hk'
                ]
            },
            map: {
                jquery: {
                    'jquery/src/selector': 'jquery/src/selector-native'    // don't pull in sizzle
                }
            }
        },
        amdbuild: {
            dir: tmpdir,
            layers: [{
                    name: 'js/app',
                    include: []
                }]
        },
        uglify: { dist: common },
        copy: {
            plugins: {
                expand: true,
                cwd: tmpdir,
                src: '<%= ' + outprop + '.plugins.rel %>',
                dest: outdir
            }
        },
        clean: {
            finish: [tmpdir],
            erase: [outdir]
        }
    });
    grunt.registerTask('amdbuild', function (amdloader) {
        var name = this.name, layers = grunt.config(name).layers;
        layers.forEach(function (layer) {
            grunt.task.run('amddepsscan:' + layer.name + ':' + name + ':' + amdloader);
            grunt.task.run('amdserialize:' + layer.name + ':' + name + ':' + outprop);
            grunt.task.run('uglify');
            grunt.task.run('copy:plugins');
        });
    });
    grunt.registerTask('build', [
        'clean:erase',
        'amdbuild:amdloader',
        'amdreportjson:amdbuild',
        'clean:finish'
    ]);
};