/*
─ │ └ ├ ┌ ┬

─ single item

─ two items
─ two items
                                           last, children
┬ root                 ['',   '',   '┬ ']     [true, true]
├── first child        ['',   '├─', '─ ']     [false, false]
├─┬ child parent       ['',   '├─', '┬ ']     [false, true]
│ ├── first child      ['│ ', '├─', '─ ']     [false, false]
│ └─┬ child parent     ['│ ', '└─', '┬ ']     [true, true]
│   ├── first child    ['│   ', '├─', '─ ']   [false, false]
│   └── last child     ['│   ', '└─', '─ ']   [true, false]
└── last child         ['', '└─', '─ ']       [true, false]

parent is last child ? '  ' : '│ '

nSibling      part 1: ├─
lastSibling   part 1: └─

hasChildren   part 2: ┬
noChildren    part 2: ─

*/

window.console.tree = (obj, prop, toString, forEach) => {
  if (!toString) toString = x => x === null ? 'null' : x === undefined ? 'undefined' : x.toString()
  if (!prop) {
    prop = obj.children ? 'children'
      : obj.childNodes ? 'childNodes'
      : null
  }
  const output = []
  const walk = (obj, part0, lastSibling) => {
    let children = obj[prop]
    if (children && !Array.isArray(children)) children = Array.from(children)
    const len = children && children.length || 0
    const part1 = lastSibling ? '└─' : '├─'
    const part2 = len ? '┬ ' : '─ '
    output.push(part0 + part1 + part2 + toString(obj))
    if (forEach) forEach(obj, part0 + part1 + part2)
    children.forEach((child, i) => {
      walk(child, part0 + (lastSibling ? '  ' : '│ '), i === len - 1)
    })
  }
  walk(obj, '  ', true)
  return output.join('\n')
}

window.console.tree.withObject = (obj, prop, toString) => window.console.tree(obj, prop, toString, (x, y) => console.log(y, x)) && undefined

window.console.tree.groups = (obj, prop) => {
  if (!prop) {
    prop = obj.children ? 'children'
      : obj.childNodes ? 'childNodes'
      : null
  }
  const walk = (obj) => {
    let children = obj[prop]
    if (children && !Array.isArray(children)) children = Array.from(children)
    if (children && children.length) {
        console.group(obj)
        children.forEach(walk)
        console.groupEnd()
    } else {
      console.log(obj)
    }
  }
  walk(obj)
}

module.exports = window.console.tree
