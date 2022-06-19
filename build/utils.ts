export function camelcase(name: string) {
  return name[0].toUpperCase() +  name.slice(1)
    .replace(/-\w/gi, (value) => value[1].toUpperCase())
    .replace(/\d[a-z]/gi, (value) => value.toUpperCase())
}
