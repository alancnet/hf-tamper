const surfaceNormal = triangle => {
  const [p1, p2, p3] = triangle
  const v = p2.clone().sub(p1)
  const w = p3.clone().sub(p1)
  const nx = (v.y * w.z) - (v.z * w.y)
  const ny = (v.z * w.x) - (v.x * w.z)
  const nz = (v.x * w.y) - (v.y * w.x)
  const m = Math.abs(nx) + Math.abs(ny) + Math.abs(nz)
  const ax = nx / m
  const ay = ny / m
  const az = nz / m
  return [ax, ay, az]
}

const toStl = (triangles) => {
  const output = []
  output.push('solid exported')
  triangles.forEach(t => {
    output.push(` facet normal ${surfaceNormal(t).join(' ')}`)
    output.push('  outer loop')
    t.forEach(v => output.push(`  vertex ${v.x} ${v.y} ${v.z}`))
    output.push('  endloop')
    output.push(' endfacet')
    output.push('')
  })
  output.push('endsolid exported')
  output.push('')
  return output.join('\n')
}

const rv = (v) => new v.constructor(v.x, -v.z, v.y)

const rotate = (triangles) => triangles.map(([a, b, c]) => [rv(a), rv(b), rv(c)])

module.exports = {toStl, rotate}