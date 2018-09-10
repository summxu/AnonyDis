function css() {
  return `  <link rel="stylesheet" href="/css/animate.css">
    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/base.css">
  `
}
function js() {
  return `  <script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/index.js"></script>
  `
}

var css = css()
var js = js()

module.exports = { css:css,js:js }