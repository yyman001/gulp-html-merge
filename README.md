# gulp-html-merge

用于html文件标记范围内容进行指定位置标识填充
依赖`through-gulp`

## 安装
```js
npm install through-gulp --save
npm install gulp-html-merge --save
//如果无法安装,可以换cnpm 安装
```

## 使用方法

###1.占位符
`name`为自定义名称,跟@block:`name`对应
```html
<!-- @import:name -->
eg:
<!-- @import:tag1 -->
```
###2.需要填充的内容
注意:建议填充内容不要包含`<!-- -->`,不然可能会出错
```html
<!-- @block:name -->
这里是填充内容范围
<!-- @end -->
eg:
<!-- @block:tag1 -->
<p>我是tag1,我是填充内容</p>
<!-- @end -->
```

###3.调用方法

```javascript
var gulp = require('gulp');
var htmlMerge = require('gulp-html-merge');
gulp.task('demo',function(){
   return gulp.src(['demo.html','tag.html'])
   .pipe(htmlMerge())
   .pipe(gulp.dest('out/'));
})
```
在test目录下有测试文件

####4.demo文件例子
demo.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    这里是demo测试页
</div>
<!-- @import:tag1 -->

<!-- @import:tag2 -->

<!-- @import:noTga -->
</body>
</html>
```
tag.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    <p>tag.html</p>
    我也可以在这里插入哦
     <!-- @import:tag1 -->
     <!-- @import:tag2 -->
</div>

<!-- @block:tag1 -->
<p>我是tag1,我是填充内容</p>
<!-- @end -->

<!-- @block:tag2 -->
<p>我是tag2,我是填充内容</p>
<!-- @end -->

</body>
</html>
```
编译后的文件结果
demo.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    这里是demo测试页
</div>
<p>我是tag1</p>

<p>我是tag2</p>

<!-- @import:noTga -->
</body>
</html>
```
tag.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    <p>tag.html</p>
    我也可以在这里插入哦
     <p>我是tag1</p>
     <p>我是tag2</p>
</div>
<!-- @block:tag1 -->
<p>我是tag1</p>
<!-- @end -->
<!-- @block:tag2 -->
<p>我是tag2</p>
<!-- @end -->
</body>
</html>
```
####过滤不合并的标签
```javascript
let filterTag = ["tag2"]; //过滤标签添加到一个数组,必须的数组
var htmlMerge = require('gulp-html-merge');
gulp.task('demo',function(){
   return gulp.src(['demo.html','tag.html'])
   .pipe(htmlMerge())
   .pipe(gulp.dest('out/'));
})
```
结果:
demo.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    这里是demo测试页
</div>
<p>我是tag1</p>

<!-- @import:noTga -->
</body>
</html>
```


一般用于多页面分部开发,这样可以把想要的合并到需要的地方
