//jsdoc -c jsdoc.json -t ./node_modules/ink-docstrap/template -R README.md -u ./docs
module.exports = function(grunt) {
    grunt.initConfig({
        jsdoc: {
            dist: {
                jsdoc: 'jsdoc',
                options: {
                    destination: 'euidoc',
                    configure: './jsdoc.json',
                    template: './node_modules/ink-docstrap/template',
                    readme: 'README.md',
                    tutorials: './docs',
                    private: false
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-jsdoc');
};