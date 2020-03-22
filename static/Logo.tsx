import * as React from 'react'

import AntDesignOutlined from '@ant-design/icons/AntDesignOutlined'
import MaterialDesign from '../src/MaterialDesign'
import HeartOutline from '../src/HeartOutline'
import Plus from '../src/Plus'
import Equal from '../src/Equal'

import './Logo.css'

export type HeaderProps = React.HTMLProps<HTMLDivElement>

export default function Header (props: HeaderProps) {
  return <div {...props} className={['Logo', props.className].filter(Boolean).join(' ')}>
    <AntDesignOutlined className="anticon__antd" />
    <Plus className="anticon__plus" />
    <MaterialDesign className="anticon__md" />
    <Equal className="anticon__equal" />
    <HeartOutline className="anticon__heart" />
  </div>
}