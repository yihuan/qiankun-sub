export function useToolkit() {
  /**
   * Make map from object
   * @param {Object} obj - Object
   */
  function makeMap(obj) {
    if (!obj) return new Map()
    return new Map(Object.entries(obj))
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return { makeMap, capitalizeFirstLetter }
}
