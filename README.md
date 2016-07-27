# gulp-create-git-branch
> It creates a new branch in the specified repository

## Installation

Install the package with npm and add it to your development dependencies:

`npm install --save-dev gulp-create-git-branch`

## Usage

### Basic

```javascript
var branch = require('gulp-create-git-branch');

gulp.task('branch', function() {
  return gulp.src('').pipe(
    branch('git@github.com:adamnowocin/gulp-create-git-branch.git', '1.0.0')
  );
});
```

### Specify temp repository folder

```javascript
var branch = require('gulp-create-git-branch');

gulp.task('branch', function() {
  return gulp.src('').pipe(
    branch('git@github.com:adamnowocin/gulp-create-git-branch.git', '1.0.0', 'tmp-repo')
  );
});
```

## License

**gulp-create-git-branch** is licensed under the [MIT license](http://opensource.org/licenses/MIT).
For the full license, see the `LICENSE` file.
