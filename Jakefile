/*globals jake, desc, task, fail, console */

var path = require('path');
var jasmine = require('jasmine-node');

desc('Default (build all)');
task('default', ['all'], function(params) {});

desc('Build all (lint, test, min)');
task('all', ['lint', 'test', 'min']);

desc('Shake out the lint');
task('lint', function() {
    var lint = path.normalize('./node_modules/.bin/jshint'),
        targets = ['Uri.js', 'Jakefile'],
        commands = targets.map(function(target) {
            return lint + ' ' + target;
        });
    console.log('linting js files', targets);
    jake.exec(commands, {
        printStdout: true
    });
});

desc('Run Jasmine specs');
task('test', function() {
    var specDir = path.normalize('./spec');
    console.log('running jasmine tests from', specDir);
    jasmine.executeSpecsInFolder({
        specFolders: [specDir],
        onComplete: function(runner, log) {
            var failed = runner.results().failedCount;
            if (failed > 0) {
                fail();
            }
        },
        isVerbose: false,
        showColors: true
    });
});

desc('Minify the compiled Uri.js file');
task('min', function() {
    var source = 'Uri.js',
        target = 'Uri.min.js',
        command = path.normalize('./node_modules/.bin/uglifyjs') + ' ' + source + ' > ' + target;
    console.log('minifying', source, 'into', target);
    jake.exec([command], {
        printStdout: true
    });
});
