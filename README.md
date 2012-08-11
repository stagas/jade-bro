# jade-bro

Compile jade views plus runtime in a single module string

## Usage

(using [frequire](https://github.com/stagas/frequire))

##### Server:

```javascript
var jadebro = require('jade-bro')
f.require('jade-bro', jadebro(__dirname + '/views'))
```

##### Browser:

```javascript
var render = require('jade-bro')
var html = render('some-view', { some: 'local' })
render.locals.foo = 'another'
el.innerHTML = html
```

## API

##### Server:

#### moduleString = jadebro(app OR viewsPath)

##### Browser:

#### html = jadebro('viewName', { options })

## Licence

MIT/X11
