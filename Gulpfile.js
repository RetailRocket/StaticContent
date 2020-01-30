var gulp = require('gulp');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var KarmaServer = require('karma').Server;
var runSequence = require('run-sequence');
var argv = require('yargs').argv;
var fs = require('fs');
var stripBom = require('strip-bom');
var zip = require('gulp-zip');
var indent = require('gulp-indent');

var integrationTestsSrc = [
    './jasmine.integration.tests/tests.retailrocket.tracking.js',
    './jasmine.integration.tests/tests.retailrocket.recommendation.js',
    './jasmine.integration.tests/tests.retailrocket.visitor.js',
    './jasmine.integration.tests/tests.retailrocket.dsp.js',
    './jasmine.integration.tests/tests.retailrocket.emailResubscription.js',
    './jasmine.integration.tests/fakeCors.js',
    './jasmine.unit.tests/jasmineHelpers.js',
    './jasmine.unit.tests/retailrocket.fakeModule.js',
    './src/retailrocket/retailrocket.utils.js',
    './src/retailrocket/internal/retailrocket.trackingClient.js',
    './src/retailrocket/internal/retailrocket.recommendationClient.js',
    './src/retailrocket/retailrocket.tracking.js',
    './src/retailrocket/retailrocket.recommendation.js',
    './src/retailrocket/retailrocket.matching.js',
    './src/retailrocket/internal/retailrocket.sspListClient.js'
];

var trackingSrc = [
    './src/retailrocket/retailrocket.punycode.js',
    './src/retailrocket/retailrocket.cookies.js',
    './src/retailrocket/retailrocket.dev.js',
    './src/retailrocket/retailrocket.segmentator.js',
    './src/retailrocket/retailrocket.cors.js',
    './src/retailrocket/retailrocket.api.js',
    './src/retailrocket/retailrocket.svyaznoy.js',
    './src/retailrocket/retailrocket.utils.js',
    './src/retailrocket/internal/retailrocket.json.js',
    './src/retailrocket/retailrocket.visitor.js',
    './src/retailrocket/retailrocket.products.js',
    './src/retailrocket/retailrocket.productsGroup.js',
    './src/retailrocket/retailrocket.categories.js',
    './src/retailrocket/internal/retailrocket.recommendationClient.js',
    './src/retailrocket/retailrocket.recommendation.js',
    './src/retailrocket/retailrocket.items.js',
    './src/Tracking/rrLibrary.js',
    './src/retailrocket/retailrocket.rrLibrary.js',
    './src/Tracking/localEventsEngine.js',
    './src/Tracking/apiInit.js',
    './src/retailrocket/retailrocket.rrApi.js',
    './src/retailrocket/internal/retailrocket.trackingClient.js',
    './src/retailrocket/retailrocket.tracking.js',
    './src/Tracking/eventsApiHandlers.js',
    './src/Tracking/localLog.js',
    './src/Tracking/lastTenItems.js',
    './src/Tracking/emailAttribution.js',
    './src/retailrocket/retailrocket.widget.js',
    './src/retailrocket/retailrocket.timing.js',
    './src/retailrocket/retailrocket.elementViewedObserver.js',
    './src/retailrocket/retailrocket.markup.js',
    './src/retailrocket/internal/retailrocket.sspListClient.js',
    './src/retailrocket/retailrocket.matching.js',
    './src/retailrocket/internal/retailrocket.partnerSettingsClient.js',
    './src/retailrocket/retailrocket.webpush.js',
    './src/retailrocket/retailrocket.emailResubscription.js',
    './src/Tracking/initPartnerSession-t.js',
    './src/Tracking/pageViewOnLoad.js'
];

var retailrocketVisitor = [
    './src/retailrocket/retailrocket.module.js',
    './src/retailrocket/retailrocket.punycode.js',
    './src/retailrocket/retailrocket.cookies.js',
    './src/retailrocket.cdnurls.cdnvideo.js',
    './src/retailrocket/retailrocket.api.js',
    './src/retailrocket/retailrocket.visitor.js'
];

var retailrocketWidget = [
    './src/retailrocket/retailrocket.module.js',
    './src/retailrocket/retailrocket.cdnurls.cdnvideo.js',
    './src/retailrocket/retailrocket.punycode.js',
    './src/retailrocket/retailrocket.utils.js',
    './src/retailrocket/retailrocket.cookies.js',
    './src/retailrocket/retailrocket.dev.js',
    './src/retailrocket.cdnurls.cdnvideo.js',
    './src/retailrocket/retailrocket.api.js',
    './src/retailrocket/retailrocket.cors.js',
    './src/retailrocket/internal/retailrocket.recommendationClient.js',
    './src/retailrocket/retailrocket.recommendation.js',
    './src/retailrocket/retailrocket.items.js',
    './src/retailrocket/retailrocket.visitor.js',
    './src/retailrocket/retailrocket.widget.js'
];

var retailrocketSegmentator = [
    './src/retailrocket/retailrocket.module.js',
    './src/retailrocket/retailrocket.punycode.js',
    './src/retailrocket/retailrocket.cookies.js',
    './src/retailrocket/retailrocket.segmentator.js'
];

var retailrocketRecommendation = [
    './src/retailrocket/retailrocket.module.js',
    './src/retailrocket/retailrocket.cors.js',
    './src/retailrocket/retailrocket.punycode.js',
    './src/retailrocket/retailrocket.cookies.js',
    './src/retailrocket/retailrocket.utils.js',
    './src/retailrocket.cdnurls.cdnvideo.js',
    './src/retailrocket/retailrocket.api.js',
    './src/retailrocket/retailrocket.dev.js',
    './src/retailrocket/internal/retailrocket.recommendationClient.js',
    './src/retailrocket/retailrocket.recommendation.js'
];

var retailrocketCookies = [
    './src/retailrocket/retailrocket.module.js',
    './src/retailrocket/retailrocket.cookies.js'
];

var retailrocketWebPushServiceWorker = [
    './src/retailrocket.webpushserviceworker.js',
    './src/rr.wpsw.import.js',
    './src/rr.wpsw.empty.js'
];

var jsDir = './bin/Content/JavaScript/';
var cssDir = './bin/Content/Css/';
var testDir = './bin/Content/JavaScript/Tests/';

function createJsErrorTrackerTemplate() {
    var registerErrorTemplate = fs.readFileSync('./src/Tracking/jsErrorTracker.wrapper', 'utf-8');
    return stripBom(registerErrorTemplate);
}

gulp.task(
    'deployIntegrationTests',
    function () {
        return gulp.src(integrationTestsSrc, {
            cwd: "./**"
        })
            .pipe(zip('integrationTests.zip'))
            .pipe(gulp.dest(testDir));
    });

gulp.task(
    'trackingjs',
    function () {
        var registerErrorTemplate = createJsErrorTrackerTemplate();
        return gulp.src(
            [
                './src/retailrocket/retailrocket.module.js',
                './src/retailrocket/retailrocket.cdnurls.cdnvideo.js'
            ].concat(trackingSrc))
            .pipe(indent({
                amount: 4
            }))
            .pipe(concat('tracking.js'))
            .pipe(wrap(registerErrorTemplate))
            .pipe(gulp.dest(jsDir));

    });

gulp.task(
    'megafonCdnTrackingJs',
    function () {
        var registerErrorTemplate = createJsErrorTrackerTemplate();
        return gulp.src(
            [
                './src/retailrocket/retailrocket.module.js',
                './src/retailrocket/retailrocket.cdnurls.megafon.js'
            ].concat(trackingSrc))
            .pipe(indent({
                amount: 4
            }))
            .pipe(concat('trackingm.js'))
            .pipe(wrap(registerErrorTemplate))
            .pipe(gulp.dest(jsDir));

    });

gulp.task(
    'apijs',
    function () {
        var registerErrorTemplate = createJsErrorTrackerTemplate();
        return gulp.src(
            [
                './src/retailrocket/retailrocket.module.js',
                './src/retailrocket/retailrocket.cdnurls.cdnvideo.js'
            ].concat(trackingSrc))
            .pipe(indent({
                amount: 4
            }))
            .pipe(concat('api.js'))
            .pipe(replace('tracking.js',
                'api.js'))
            .pipe(wrap(registerErrorTemplate))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'retailrocketVisitorJs',
    function () {
        return gulp.src(retailrocketVisitor)
            .pipe(concat('retailrocket.visitor.js'))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'retailrocketWidgetJs',
    function () {
        return gulp.src(retailrocketWidget)
            .pipe(concat('retailrocket.widget.js'))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'retailrocketWidgetCss',
    function () {
        return gulp.src('./src/retailrocket/retailrocket.widget.css')
            .pipe(gulp.dest(cssDir));
    });

gulp.task(
    'retailrocketRecommendationJs',
    function () {
        return gulp.src(retailrocketRecommendation)
            .pipe(concat('retailrocket.recommendation.js'))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'retailrocketSegmentatorJs',
    function () {
        return gulp.src(retailrocketSegmentator)
            .pipe(concat('retailrocket.segmentator.js'))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'retailrocketCookiesJs',
    function () {
        return gulp.src(retailrocketCookies)
            .pipe(concat('retailrocket.cookies.js'))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'retailrocketWebPushServiceWorkerJs',
    function () {
        return gulp.src(retailrocketWebPushServiceWorker)
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'minifyjs',
    [
        'trackingjs',
        'megafonCdnTrackingJs',
        'apijs',
        'retailrocketVisitorJs',
        'retailrocketWidgetJs',
        'retailrocketSegmentatorJs',
        'retailrocketRecommendationJs',
        'retailrocketCookiesJs',
        'retailrocketWebPushServiceWorkerJs'
    ],
    function () {
        return gulp.src([
            jsDir + 'tracking.js',
            jsDir + 'trackingm.js',
            jsDir + 'api.js',
            jsDir + 'retailrocket.visitor.js',
            jsDir + 'retailrocket.widget.js',
            jsDir + 'retailrocket.recommendation.js',
            'retailrocket.webpushserviceworker.js'
        ])
            .pipe(sourcemaps.init())
            .pipe(uglify())
            //.pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(jsDir));
    });

gulp.task(
    'minifycss', ['retailrocketWidgetCss'],
    function () {
        return gulp.src([cssDir + 'retailrocket.widget.css'])
            .pipe(sourcemaps.init())
            .pipe(minifyCss({
                processImport: false
            }))
            //.pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(cssDir));
    });

gulp.task(
    'tracking-hint',
    function () {
        return gulp.src(apiSrc)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

function startKarma(fixtureName, done) {
    console.log(__dirname);

    var config = {
        frameworks: ['jasmine'],
        basePath: __dirname,
        configFile: __dirname + '/tests/' + fixtureName + '/karma.js',
        singleRun: true,
        colors: false,
        autoWatch: false,
        browsers: ['PhantomJS'],
        reporters: [argv.reporter || 'spec']
    };

var server = new KarmaServer(
		config,
		function() {
			done();
        });
    server.start();
}

gulp.task(
    'tests-retailrocket.widget',
    function (done) {
        startKarma('retailrocket.widget', done);
    });

gulp.task(
    'tests-retailrocket.utils',
    function (done) {
        startKarma('retailrocket.utils', done);
    });

gulp.task(
    'tests-retailrocket.api',
    function (done) {
        startKarma('retailrocket.api', done);
    });

gulp.task(
    'tests-retailrocket.segmentator',
    function (done) {
        startKarma('retailrocket.segmentator', done);
    });

gulp.task(
    'tests-retailrocket.dev',
    function (done) {
        startKarma('retailrocket.dev', done);
    });

gulp.task(
    'tests-retailrocket.categories',
    function (done) {
        startKarma('retailrocket.categories', done);
    });

gulp.task(
    'tests-retailrocket.products',
    function (done) {
        startKarma('retailrocket.products', done);
    });

gulp.task(
    'tests-retailrocket.visitor',
    function (done) {
        startKarma('retailrocket.visitor', done);
    });

gulp.task(
    'tests-retailrocket.productsGroup',
    function (done) {
        startKarma('retailrocket.productsGroup', done);
    });

gulp.task(
    'tests-segmentator',
    function (done) {
        startKarma('segmentator', done);
    });

gulp.task(
    'tests-retailrocket.markup',
    function (done) {
        startKarma('retailrocket.markup', done);
    });

gulp.task(
    'tests-lastTenItems',
    function (done) {
        startKarma('tracking.lastTenItems', done);
    });

gulp.task(
    'tests-emailAttribution',
    function (done) {
        startKarma('tracking.emailAttribution', done);
    });

gulp.task(
    'tests-eventsApiHandlers',
    function (done) {
        startKarma('tracking.eventsApiHandlers', done);
    });

gulp.task(
    'tests-localEventsEngine',
    function (done) {
        startKarma('tracking.localEventsEngine', done);
    });

gulp.task(
    'tests-localLog',
    function (done) {
        startKarma('tracking.localLog', done);
    });

gulp.task(
    'tests-pageViewOnLoad',
    function (done) {
        startKarma('tracking.pageViewOnLoad', done);
    });

gulp.task(
    'generate-source.jsErrorTracker.js',
    function () {
        var registerErrorTemplate = createJsErrorTrackerTemplate();
        var errorHandlingTemplate = stripBom(fs.readFileSync('./tests/tracking.jsErrorTracker/jsErrorGenerator.wrapper',
            'utf-8'));

        return gulp.src('./tests/tracking.jsErrorTracker/jsErrorGenerator.js')
            .pipe(indent({
                amount: 4
            }))
            .pipe(concat('.source.jsErrorTracker.js'))
            .pipe(wrap(registerErrorTemplate))
            .pipe(wrap(errorHandlingTemplate))
            .pipe(gulp.dest('./tests/tracking.jsErrorTracker/'));
    });

gulp.task(
    'tests-jsErrorTracker',
    function (done) {
        runSequence(
            'generate-source.jsErrorTracker.js',
            function () {
                startKarma('tracking.jsErrorTracker', done);
            });
    });

gulp.task(
    'tests-retailrocket.visitor',
    function (done) {
        startKarma('retailrocket.visitor', done);
    });

gulp.task(
    'tests-retailrocket.punycode',
    function (done) {
        startKarma('retailrocket.punycode', done);
    });

gulp.task(
    'tests-retailrocket.cookies',
    function (done) {
        startKarma('retailrocket.cookies', done);
    });

gulp.task(
    'jsTests',
    function (done) {
        runSequence(
            'tests-segmentator',
            'retailrocketVisitorJs',
            'retailrocketWidgetJs',
            'retailrocketSegmentatorJs',
            'retailrocketRecommendationJs',
            'retailrocketCookiesJs',
            'retailrocketWidgetCss',
            'tests-retailrocket.widget',
            'tests-retailrocket.utils',
            'tests-retailrocket.categories',
            'tests-retailrocket.products',
            'tests-retailrocket.productsGroup',
            'tests-retailrocket.markup',
            'tests-jsErrorTracker',
            'tests-retailrocket.visitor',
            'tests-retailrocket.api',
            'tests-retailrocket.dev',
            'tests-retailrocket.segmentator',
            'tests-lastTenItems',
            'tests-emailAttribution',
            'tests-eventsApiHandlers',
            'tests-localEventsEngine',
            'tests-localLog',
            'tests-pageViewOnLoad',
            'tests-retailrocket.punycode',
            'tests-retailrocket.cookies',
            done
        );
    });

gulp.task(
    'Release', [
        'minifyjs',
        'minifycss',
        'deployIntegrationTests'
    ]);

gulp.task(
    'Debug', [
        'trackingjs',
        'apijs',
        'megafonCdnTrackingJs',
        'retailrocketVisitorJs',
        'retailrocketWidgetJs',
        'retailrocketSegmentatorJs',
        'retailrocketRecommendationJs',
        'retailrocketCookiesJs',
        'retailrocketWidgetCss',
        'retailrocketWebPushServiceWorkerJs'
    ]);

gulp.task(
    'default', ['Debug']);

gulp.task(
    'BuildAndTest',
    function (done) {
        runSequence('Debug', 'jsTests', done);
    });
