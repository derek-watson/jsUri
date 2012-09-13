var jasmine = require('jasmine-node'),
    srcDir = './src',
    distDir = './dist',
    sources = [
        'intro.js',
        'query.js',
        'uri.js'
    ].map(function (srcFile) {
        return srcDir + '/' + srcFile;
    });

desc('Default (build all)');
task('default', ['all'], function(params) {});

desc('Build all (lint, test, dist_dir, compile, min)');
task('all', ['lint', 'test', 'dist_dir', 'compile', 'min']);

desc('Shake out the lint');
task('lint', function() {
    var lint = 'jshint',
        targets = sources.slice().concat('Jakefile'),
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
    var specDir = './spec';
    console.log('running jasmine tests from', specDir);
    jasmine.executeSpecsInFolder(specDir, function(runner, log) {
        var failed = runner.results().failedCount;
        if (failed > 0) {
            fail();
        }
    }, false, true, ".spec.js$");
});

desc('Create the dist directory');
task('dist_dir', function() {
    console.log('creating distribution directory', distDir);
    jake.mkdirP(distDir);
});

desc('Compile distribution uri.js');
task('compile', sources, function() {
    var target = distDir + '/uri.js',
        command = 'cat ' + sources.join(' ') + ' > ' + target;
    console.log('compiling', target, 'from', sources);
    jake.exec([command], {
        printStdout: true
    });
});

desc('Minify the compiled uri.js file');
task('min', function() {
    var source = distDir + '/uri.js',
        target = distDir + '/uri.min.js',
        command = 'uglifyjs ' + distDir + '/uri.js > ' +target;
    console.log('minifying', source, 'into', target);
    jake.exec([command], {
        printStdout: true
    });
});

desc('Remove the dist directory');
task('clean', function () {
    jake.rmRf(distDir);
});
