import icons from '@mdi/svg/meta.json'
import * as paths from '@mdi/js'
import camelcase from 'camelcase'
import { writeFileSync, readFileSync } from 'fs'
import { render } from 'mustache'
import { createHash } from 'crypto'

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T

let limit = Number(process.argv[2])
const index = [] as (Unpacked<typeof icons> & {
  component: string
  path: string
})[]
const templateIcon = readFileSync('./build/Icon.mustache', 'utf8')
const templateSvg = readFileSync('./build/Svg.mustache', 'utf8')
const templateCss = readFileSync('./build/Css.mustache', 'utf8')

for (const icon of icons) {
  const name = camelcase(icon.name)
  const component = name.slice(0, 1).toUpperCase() + name.slice(1)

  if (component === 'Textbox') {
    continue;
  }

  const pathName = ('mdi' + component) as keyof typeof paths
  const path = paths[pathName] as string
  const data = { ...icon, component, path }

  const reactFile = `./src/${component}.tsx`
  const reactContent = render(templateIcon, data)

  index.push(data)
  if (Number.isFinite(limit)) {
    console.log('')
    console.log(`// ${reactFile}`)
    console.log(reactContent)
    limit--
    if (limit >= 0) {
      break
    }
  } else {
    console.log(`writing ${reactFile}`)
    writeFileSync(reactFile, reactContent)
  }
}

const indexFile = './src/index.ts'
const indexContent =
  index
    .map(
      data =>
        `export { default as ${data.component} } from './${data.component}'`,
    )
    .join('\n') + '\n'

if (!Number.isFinite(limit)) {
  const len = index.length
  const size = 100
  let offset = 0
  const hashes = []
  while (offset < len) {
    const chunk = index
      .slice(offset, offset + size)
      .map(({ name, path }, i) => {
        return {
          name,
          path,
          x: (i % 10) * 72,
          y: Math.floor(i / 10) * 36,
          x2: (i % 10) * 72 + 36,
          y2: Math.floor(i / 10) * 36,
        }
      })
    const out = render(templateSvg, { icons: chunk })
    const hash = createHash('md5')
      .update(out)
      .digest('hex')
      .slice(0, 10)
    offset = offset + size
    console.log(`writing ./static/icons/${hash}.svg`)
    writeFileSync(`static/icons/${hash}.svg`, out)

    const css = render(templateCss, {
      icons: chunk.map(({ path, name, x, y, x2, y2 }) => ({
        path,
        name,
        x: -x,
        y: -y,
        x2: -x2,
        y2: -y2,
      })),
      hash,
    })
    console.log(`writing ./static/icons/${hash}.css`)
    writeFileSync(`./static/icons/${hash}.css`, css)

    hashes.push(hash)
  }

  // console.log(`writing ./static/chunk/index.ts`)
  // writeFileSync('static/chunk/index.ts', `export default (resolve: (icons: Array<[string, any]>) => void, reject: (err: Error) => void) => {\n${hashes.map(hash => `  import('./${hash}').then(m => m.default as [string, any]).then(resolve).catch(reject)`).join(';\n')};\n}\n`)

  console.log(`writing ./static/icons/icons.json`)
  writeFileSync(
    './static/icons/icons.json',
    JSON.stringify(index.map(({ name }) => name)),
  )
  console.log(`writing ./static/icons/hashes.json`)
  writeFileSync('./static/icons/hashes.json', JSON.stringify(hashes))
} else {
  console.log('')
  console.log(`// ${indexFile}`)
  console.log(indexContent)
}
