export class Helper {
  static mergePartsQuery(parts, operator) {
    let sub = parts.filter((part) => {
      return part
    }).map((part) => {
      return `(${part})`
    })
    return sub.join(` ${operator} `)
  }
};
