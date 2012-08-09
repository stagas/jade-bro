var fs = require('fs')
var path = require('path')
var jade = require('jade')
var toSource = require('tosource')

function readdir (dirname, arr) {
  arr = arr || []
  
  fs.readdirSync(dirname)
    .map(function (file) { return path.join(dirname, file) })
    .forEach(function (file) {
      if (fs.statSync(file).isDirectory()) readdir(file, arr)
      else arr.push(file)
    })

  return arr
}

function readfile (filename) {
  return { name: filename, contents: fs.readFileSync(filename, 'utf8') }
}

function clean () {
  var a = arguments[0]
  for (var i = 1, len = arguments.length; i < len; i++) {
    a = a.replace(arguments[i], '')
  }
  return a
}

function merge (t, s) {
  for (var k in s) {
    if (s.hasOwnProperty(k)) t[k] = s[k]
  }
  return t
}

function replace (x, y) { return function (a) { return a.replace(x, y) } }

var slash = replace(/\\/g, '/')

var compile = module.exports = function (what) {
  var dirname

  if ('string' === typeof what) dirname = what
  else if (what && what.settings) dirname = what.settings.views

  dirname = slash(path.normalize(dirname))

  var views = {}

  readdir(dirname)
    .map(readfile)
    .forEach(function (file) {
      var view = clean(slash(file.name), dirname + '/', '.jade')
      views[view] = jade.compile(file.contents, {
        filename: file.name
      , inline: false
      , compileDebug: false
      , client: true
      })
    })

  var exp = '\nvar jade = exports = ' + toSource(jade.runtime) + ';'
          + 'var views = ' + toSource(views) + ';'
          + 'var merge = ' + merge + ';'
          + 'var fn = function (view, opts) {'
          + '  return views[view].call(this, merge(fn.locals, opts || {}));'
          + '};'
          + 'fn.locals = {};'
          + 'module.exports = fn;\n'

  return exp
}
