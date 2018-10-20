window.walk = function(root) {
  /*      const walk = (obj, i, tree, more) => {
      const indent = tree + (more ? ' ├' : ' └')  //"".padRight(i * 2, ' ')
      console.log(indent + obj.toString())
      if (obj && obj.children) obj.children.forEach((x, y) => walk(x, i + 1, tree + (y < obj.children.length - 1 ? ' │' : '  '), y < obj.children.length - 1))
  }
  */
  const walk = (obj, part0, lastSibling) => {
    const part1 = lastSibling ? '└─' : '├─'
    const part2 = obj.children.length ? '┬ ' : '─ '
    console.log(part0 + part1 + part2 + obj.toString())
    obj.children.forEach((child, i) => {
      walk(child, part0 + (lastSibling ? '  ' : '│ '), i === obj.children.length - 1)
    })
  }
  walk(root, '  ', true)
}

module.exports = walk