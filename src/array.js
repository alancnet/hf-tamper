const slices = (array, step) => {
  const ret = []
  for (var i = 0; i < array.length; i += step) {
    ret.push(array.slice(i, i + step))
  }
  return ret
}

const pushAll = (target, array) =>
  target.constructor.prototype.push.apply(target, array)

module.exports = {
  slices,
  pushAll
}