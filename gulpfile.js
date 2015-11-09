'use strict';

// Install: you must install gulp both globally *and* locally.
// Make sure you `$ npm install -g gulp`

/**
 * Dependencies
 */

var $             = require('gulp-load-plugins')({ lazy: true });
var del           = require('del');
var gulp          = require('gulp');
var terminus      = require('terminus');
var runSequence   = require('run-sequence');

/**
 * Banner
 */

var pkg = require('./package.json');
var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.licenses[0].type %>',
    ' */',
    ''
].join('\n');

/**
 * Paths
 */

var paths = {
    clean: [
        'public/js/**/*.js',
        'public/js/**/*.map',
        'public/js/**/*.min.js',
        'public/css/**/*.css',
        'public/css/**/*.min.css',
    ],
    js: [
        // Enable/disable as needed but only turn on
        // .js that is needed on *every* page. No bloat!
        // =========================================
        'lib/config.js',
        'public/lib/strophe/strophe.js',
        'public/lib/strophejs-plugins/disco/strophe.disco.js',
        'public/lib/strophejs-plugins/caps/strophe.caps.jsonly.js',
        'public/lib/jquery-ui/jquery-ui.min.js',
        'public/lib/bootstrap/js/tooltip.js',
        'public/lib/popover/popover.js',
        'public/lib/toastr/toastr.min.js',
        'lib/interface_config.js',
        'lib/analytics.js',
        //'public/lib/jquery-autosize/dist/autosize.min.js',
        'public/lib/jquery.autosize.js',
        'public/lib/jquery-impromptu/dist/jquery-impromptu.min.js'
    ],
    lint: [
        //'public/js/service/**/*.js',
        //'public/js/modules/**/*.js',
        'lib/app/app.js',
        'lib/config.js',
        'lib/analytics.js',
        'lib/interface_config.js',
        'gulpfile.js'
    ],
    app: [
        'lib/app/app.js',
        'lib/app/**/*.js'
    ],
    less: [
        'less/**/*.css'
    ]
};

/**
 * Clean
 */

// Return the stream so that gulp knows the task is asynchronous
// and waits for it to terminate before starting dependent tasks.

// gulp.task('clean', function () {
//   return gulp.src(paths.clean, { read: false })
//     .pipe($.rimraf());
// });

gulp.task('clean', function (cb) {
    del(paths.clean, cb);
});

/**
 * Process CSS
 */

var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

gulp.task('styles', function () {
    return gulp.src(paths.less)                 // Read in Less files
        .pipe($.less({                          // Compile Less files
                plugins: [autoprefix, cleancss]
            }))
        //.pipe($.csslint('.csslintrc'))          // Lint CSS
        //.pipe($.csslint.reporter())             // Report issues
        .pipe($.rename({ suffix: '.min' }))     // Add .min suffix
        .pipe($.csso())                         // Minify CSS
        .pipe($.header(banner, { pkg : pkg }))  // Add banner
        .pipe($.size({ title: 'CSS:' }))        // What size are we at?
        .pipe(gulp.dest('./public/css'))        // Save minified CSS
        .pipe($.livereload());                  // Initiate a reload
});


/**
 * Process Scripts
 */

gulp.task('scripts', function () {
    return gulp.src(paths.js)                 // Read .js files
        .pipe($.concat(pkg.name + '.js'))       // Concatenate .js files
        .pipe(gulp.dest('./public/js'))         // Save main.js here
        .pipe($.rename({ suffix: '.min' }))     // Add .min suffix
        .pipe($.uglify({ outSourceMap: true })) // Minify the .js
        .pipe($.header(banner, { pkg : pkg }))  // Add banner
        .pipe($.size({ title: 'JS:' }))         // What size are we at?
        .pipe(gulp.dest('./public/js'))         // Save minified .js
        .pipe($.livereload());                  // Initiate a reload
});

gulp.task('browserify', function () {
   return gulp.src('./lib/app/app.js')
       .pipe($.browserify({
               standalone: 'APP'
           }
       ))
       .pipe($.rename('app.js'))
       .pipe(gulp.dest('./public/js'))
       .pipe($.rename({ suffix: '.min' }))     // Add .min suffix
       .pipe($.uglify({ outSourceMap: true })) // Minify the .js
       .pipe($.header(banner, { pkg : pkg }))  // Add banner
       .pipe($.size({ title: 'APP:' }))         // What size are we at?
       .pipe(gulp.dest('./public/js'))         // Save minified .js
       .pipe($.livereload());
});

/**
 * JSHint Files
 */

gulp.task('lint', function () {
    return gulp.src(paths.lint)               // Read .js files
        .pipe($.jshint())                       // lint .js files
        .pipe($.jshint.reporter('jshint-stylish'));
});

/**
 * JSCS Files
 */

gulp.task('jscs', function () {
    return gulp.src(paths.lint)               // Read .js files
        .pipe($.jscs())                         // jscs .js files
        .on('error', function (e) {
            $.util.log(e.message);
            $.jscs().end();
        })
        .pipe(terminus.devnull({ objectMode: true }));
});

/**
 * Build Task
 *   - Build all the things...
 */

gulp.task('build', function (cb) {
    runSequence(
        'clean',                                // first clean
        ['lint', 'jscs'],                       // then lint and jscs in parallel
        ['styles', 'scripts', 'browserify'],        // etc.
        cb);
});


/**
 * Nodemon Task
 */

gulp.task('nodemon', ['build'], function (cb) {
    $.livereload.listen();
    var called = false;
    $.nodemon({
        script: './bin/www',
        verbose: false,
        env: { 'NODE_ENV': 'development', 'DEBUG': 'meet' },
        // nodeArgs: ['--debug']
        ext: 'js',
        ignore: [
            'gulpfile.js',
            'public/',
            'views/',
            'less/',
            'node_modules/'
        ]
    })
        .on('start', function () {
            setTimeout(function () {
                if (!called) {
                    called = true;
                    cb();
                }
            }, 3000);  // wait for start
        })
        .on('restart', function () {
            setTimeout(function () {
                $.livereload.changed('/');
            }, 3000);  // wait for restart
        });
});

/**
 * Open the browser
 */

gulp.task('open', ['nodemon'], function () {
    var options = {
        url: 'http://localhost:3000/'
    };
    // A file must be specified or gulp will skip the task
    // Doesn't matter which file since we set the URL above
    // Weird, I know...
    gulp.src('./public/favicon.ico')
        .pipe($.open('', options));
});

/**
 * Default Task
 */

gulp.task('default', ['open'], function () {
    gulp.watch(paths.less, ['styles']);
    gulp.watch(paths.js, ['scripts']);
    gulp.watch(paths.app, ['browserify']);
    gulp.watch(paths.lint, ['lint', 'jscs']);
    gulp.watch('views/**/*.hbs').on('change', $.livereload.changed);
});

