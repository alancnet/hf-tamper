
window.exportCode = () => {
  window.code = {}
  for (let pkg of Object.values(window.FuseBox.packages)) {
    for (let moduleName in pkg.f) {
      window.code[moduleName] = pkg.f[moduleName].fn.toString()
    }
  }
  
  console.log('All code saved to `window.code`. `exportCode()` to save it')
  window.console.save(window.code, 'heroforge.json')
}

module.exports = window.exportCode