import icons from '@mdi/svg/meta.json'
import * as paths from '@mdi/js'
import camelcase from 'camelcase'
import { writeFileSync, readFileSync } from 'fs'
import { render } from 'mustache'
import { createHash } from 'crypto'
import { FileLogger } from './FileLogger'

type Data = typeof icons[0] & {
  component: string;
  path: string;
}

const FILES_PER_LINE = 3
const index: Data[] = []
const templateCss = readFileSync('./templates/css.mustache', 'utf8')
const templateIcon = readFileSync('./templates/icon.mustache', 'utf8')
const templateSvg = readFileSync('./templates/svg.mustache', 'utf8')
const templateTypes = readFileSync('./templates/types.mustache', 'utf8')
const fileLogger = new FileLogger(FILES_PER_LINE)
const writeFile = function(path: string, data: string){
  fileLogger.log(path)
  writeFileSync(path, data)
}

writeFile('./src/types.ts', render(templateTypes, {}))

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
  fileLogger.log(reactFile)
  writeFile(reactFile, reactContent)
}

fileLogger.flush()

/**
 * Render static templates 
 */
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

  writeFile(`./static/icons/${hash}.svg`, out)

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

  writeFile(`./static/icons/${hash}.css`, css)
  hashes.push(hash)
}

const iconsFile = './static/icons/icons.json'
writeFile(iconsFile, JSON.stringify(index.map(({ name }) => name)))

const hashesFile = './static/icons/hashes.json'
writeFile(hashesFile, JSON.stringify(hashes))

fileLogger.flush()
