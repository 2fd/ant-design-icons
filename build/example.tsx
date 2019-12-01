import React from 'react'
import Icon, { IconProps } from 'antd/lib/icon'

/**
 * [ab-testing](https://github.com/Templarian/MaterialDesign-SVG/blob/master/svg/ab-testing.svg) icon from [Material Design](https://github.com/Templarian/MaterialDesign)
 * 
 * @author Michael Richins
 * @version 4.0.96
 */
export default function AbTestingIcon(props: IconProps) {
  return (
    <Icon
      component={
        () => <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 2A2 2 0 0 0 2 4V12H4V8H6V12H8V4A2 2 0 0 0 6 2H4M4 4H6V6H4M22 15.5V14A2 2 0 0 0 20 12H16V22H20A2 2 0 0 0 22 20V18.5A1.54 1.54 0 0 0 20.5 17A1.54 1.54 0 0 0 22 15.5M20 20H18V18H20V20M20 16H18V14H20M5.79 21.61L4.21 20.39L18.21 2.39L19.79 3.61Z" />
        </svg>
      }
      {...props}
    />
  )
}

<AbTestingIcon />