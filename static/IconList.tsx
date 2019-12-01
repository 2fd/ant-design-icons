import * as React from 'react'
import Text from 'antd/lib/typography/Text'
import icons from './icons/icons.json'
import hashes from './icons/hashes.json'

import './IconList.css'

const ICON_BOX_WIDTH = 150
const ICON_BOX_HEIGHT = 100
const ICON_BATCH = 3
const ICONS = icons.map((icon) => [icon, icon[0].toUpperCase() + icon.slice(1).replace(/-(\w)/gi, (_, w) => w.toUpperCase()) + 'Icon'])

export type IconListProps = React.HTMLProps<HTMLDivElement> & {
  filter?: string
  onClickIcon?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function IconList({
  filter,
  style,
  className,
  onClickIcon,
  ...props
}: IconListProps) {

  const currentIcons = React.useMemo(() => {
    const filters = (filter || '').trim().split(/\W+/gi).filter(Boolean).map(f => f.toLowerCase())
    if (filters.length === 0) {
      return ICONS
    }

    return ICONS.filter(([name, component]) => filters.every(filter => name.includes(filter) || component.includes(filter)))
  }, [ filter ])

  const ref = React.useRef<HTMLDivElement>(null)
  const [layout, setLayout] = React.useState({
    width: 0,
    iconsPerRow: 0,
    top: 0,
    left: 0,
  })

  const [range, setRange] = React.useState({ from: 0, to: 0 })

  const height = layout.iconsPerRow && Math.ceil(Math.ceil(currentIcons.length / layout.iconsPerRow) * ICON_BOX_HEIGHT)

  React.useEffect(() => {

    let range = { from: 0, to: 0 }

    let layout = {
      width: 0,
      iconsPerRow: 0,
      top: 0,
      left: 0,
    }

    function calculateLayout() {
      let current = ref.current as HTMLElement
      const width = current.offsetWidth || 0
      const iconsPerRow = Math.floor(width / ICON_BOX_WIDTH)
      const left = Math.floor((width % ICON_BOX_WIDTH) / 2)
      let top = current.offsetTop
      while (current.parentElement) {
        current = current.parentElement
        top += current.offsetTop
      }

      return { width, iconsPerRow, left, top }
    }

    function calculateRange(currentLayout: { top: number, iconsPerRow: number }) {
      const scroll = window.scrollY - currentLayout.top;
      const iconRowOnScreen = Math.ceil(window.innerHeight / ICON_BOX_HEIGHT)
      const iconsOnScreen = iconRowOnScreen * currentLayout.iconsPerRow
      // console.log(Math.floor(scroll / ICON_BOX_SIZE), ICON_BATCH * iconRowOnScreen)
      const from = Math.max(
        (Math.floor(scroll / ICON_BOX_HEIGHT) - ICON_BATCH * iconRowOnScreen) * currentLayout.iconsPerRow, 0)
      const to = from + (ICON_BATCH * 2 * iconsOnScreen)
      // console.log(scroll, (from / currentLayout.iconsPerRow) * ICON_BOX_SIZE + currentLayout.top )
      return { from, to }
    }

    hashes.reduce(
      (prev, hash) => prev.then(() => loadStylesheet(hash)),
      Promise.resolve(),
    )

    function handleLayoutChange () {
      const newLayout = calculateLayout()
      if (layout.iconsPerRow !== newLayout.iconsPerRow) {
        setRange(calculateRange(newLayout))
      }
      setLayout(newLayout)
      layout = newLayout
    }

    function handleRangeChange() {
      const newRange = calculateRange(layout)
      if (newRange.from !== range.from || newRange.to !== range.to) {
        setRange(newRange)
        range = newRange
      }
    }

    handleLayoutChange()
    window.addEventListener('resize', handleLayoutChange)
    window.addEventListener('scroll', handleRangeChange)

    return () => {
      window.removeEventListener('resize', handleLayoutChange)
      window.removeEventListener('scroll', handleRangeChange)
    }
  }, [])

  return (
    <div
      {...props}
      ref={ref}
      style={{
        ...style,
        height: height,
        position: 'relative',
      }}
      className={'IconList'}
    >
      {!!layout.width &&
        currentIcons.slice(range.from, range.to).map(([name, Component], i) => {
          const { top, left } = calculatePosition({
            itemIndex: i + range.from,
            itemWidth: ICON_BOX_WIDTH,
            itemHeight: ICON_BOX_HEIGHT,
            itemsPerRow: layout.iconsPerRow,
          })
          return (
            <a
              key={name}
              className="IconList__Item"
              title={Component}
              data-name={name}
              data-component={Component}
              onClick={onClickIcon}
              style={{ top, left: left + layout.left + 5 }}
            >
              <span>
                <i className={`mdi-icon mdi-${name}`} />
                <i className={`mdi-icon mdi-${name} reverse`} />
              </span>
              <Text>{Component}</Text>
            </a>
          )
        })}
    </div>
  )
}

IconList.defaultProps = {
  icons: [],
  filter: '',
}

type PositionParams = {
  itemIndex: number
  itemsPerRow: number
  itemWidth: number
  itemHeight: number
}

type Position = {
  top: number
  left: number
}

function calculatePosition(params: PositionParams): Position {
  if (params.itemIndex === 0) {
    return { top: 0, left: 0 }
  }

  const top = (params.itemIndex / params.itemsPerRow) | 0
  const left = params.itemIndex % params.itemsPerRow

  return { top: top * params.itemHeight, left: left * params.itemWidth }
}

async function loadStylesheet(hash: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link') as HTMLLinkElement
    link.rel = 'stylesheet'
    link.href = `/icons/${hash}.css`
    link.onload = () => resolve()
    link.onerror = () => reject()
    document.head.prepend(link)
  })
}
