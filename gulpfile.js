var gulp = require('gulp');
var concat = require('gulp-concat');                            //- 多个文件合并为一个；
// var minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');                                  //- 对文件名加MD5后缀

//- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
// var pump = require('pump');
var rename = require('gulp-rename')
var notify = require('gulp-notify');
var babel = require('gulp-babel');
var minifyHTML   = require('gulp-minify-html');




gulp.task('replace',function(){

    return gulp.src(['src/js/global.js'])  //选择合并的JS

    .pipe(replace('asset/img/', 'https://static.allinfun.cn/game/tale-of-crow-country/img/'))
    //替换图片路径
    .pipe(replace('asset/sound/', 'https://static.allinfun.cn/game/tale-of-crow-country/sound/'))
    .pipe( gulp.dest('src/js') );


});


gulp.task('minifyjs',function(){
    return gulp.src(['src/js/global.js','src/js/managers/sound-manager.js','src/js/states/base-state.js','src/js/states/boot-state.js','src/js/states/preload-state.js','src/js/states/menu-state.js','src/js/states/story-state.js','src/js/states/start-state.js','src/js/states/win-state.js','src/js/main.js'])  //选择合并的JS
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('tale-of-crow.js'))   //合并js
        .pipe(replace('asset/img/', 'https://static.allinfun.cn/game/tale-of-crow-country/img/'))          //替换图片路径
        .pipe(replace('asset/sound/', 'https://static.allinfun.cn/game/tale-of-crow-country/sound/'))          //替换音频路径
        .pipe(gulp.dest('dist/js'))         //输出
        .pipe(rename({suffix:'.min'}))     //重命名
        .pipe(uglify())                    //压缩
        .pipe(gulp.dest('dist/js'))            //输出

});

gulp.task('scripts', function () {
    return gulp.src('dist/js/tale-of-crow.min.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe( rev.manifest())
        .pipe( gulp.dest( 'dist/js' ) )

});



gulp.task('rev', function () {
    return gulp.src(['dist/js/*.json', 'index.html'])
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe( minifyHTML({
            empty:true,
            spare:true
        }) )
        .pipe( gulp.dest('./dist') );

});

gulp.task('copy',  function() {
    return gulp.src(['./src/js/level.json'])
        .pipe(gulp.dest('dist/js'))

});

gulp.task('copy_img', function(){

    return gulp.src(['./asset/img/puzzle_*'])
    .pipe(gulp.dest('dist/asset/img'))

});


gulp.task('copy_libs', function(){

    return gulp.src(['./libs/*'])
        .pipe(gulp.dest('dist/libs'))

});




gulp.task('default', ['minifyjs','scripts','rev','copy','copy_libs']);