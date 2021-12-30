import * as React from 'react'
import Button from 'antd/lib/button'
import Search from 'antd/lib/input/Search'
import message from 'antd/lib/message'
import NpmIcon from '../src/Npm'
import GithubIcon from '../src/Github'
import IconList from './IconList'
import Logo from './Logo'

// import 'antd/dist/antd.min.css'
// import 'antd/lib/button/style/index.css'
// import 'antd/lib/input/style/index.css'
// import 'antd/lib/message/style/index.css'
import './Site.css'

export default function Site() {
  const [filter, setFilter] = React.useState(window.location.hash.slice(1))

  let debounceFilterChange: NodeJS.Timeout
  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFilter = event.target.value

    if (debounceFilterChange) {
      clearTimeout(debounceFilterChange)
    }

    debounceFilterChange = setTimeout(() => {
      window.location.hash = '#' + newFilter
      setFilter(newFilter)
    }, 300)
  }

  React.useEffect(() => {
    function handleScrollChange() {
      const scroll = window.scrollY
      if (scroll < 200) {
        document.body.classList.remove('fixed')
      } else if (scroll > 200) {
        document.body.classList.add('fixed')
      }
    }

    window.addEventListener('resize', handleScrollChange)
    window.addEventListener('scroll', handleScrollChange)

    return () => {
      window.removeEventListener('resize', handleScrollChange)
      window.removeEventListener('scroll', handleScrollChange)
    }
  }, [])

  const input = React.useMemo(() => {
    const el = document.createElement('input')
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    return el
  }, [])

  function handleClickIcon(event: React.MouseEvent<HTMLAnchorElement>) {
    const component = event.currentTarget.dataset.component
    const value = `<${component} />`
    input.value = value
    input.select()
    document.execCommand('copy')
    const selection = document.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
    message.success(
      <>
        <code>{value}</code> copied 🎉
      </>,
    )

    // const newCopyList = copyList.filter
  }

  return (
    <>
      <header>
        <Logo />
      </header>
      <section className="search-container">
        <div className="search">
          <Search
            size="large"
            placeholder="Search icon here, click icon to copy code"
            defaultValue={filter}
            onChange={handleFilterChange}
          />
          <Button size="large" href="https://github.com/2fd/ant-design-icons">
            <GithubIcon />
          </Button>
          <Button size="large" href="https://www.npmjs.com/package/@2fd/ant-design-icons" >
            <NpmIcon className="npm" />
          </Button>
          </div>
      </section>
      <section className="icon-list">
        <IconList filter={filter} onClickIcon={handleClickIcon} />
      </section>
    </>
  )
}
