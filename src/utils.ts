export function findKey<T>(obj: Record<string, any>, key: string): T | undefined {
  if (obj.hasOwnProperty(key)) {
      return obj[key];
  }

  for (let k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
          let result = findKey<T>(obj[k], key);
          if (result !== undefined) {
              return result;
          }
      }
  }

  return undefined;
}