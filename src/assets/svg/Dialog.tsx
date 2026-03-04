import * as React from 'react'
import Svg, {Path, SvgProps} from 'react-native-svg'

const Dialog = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#D9D9D9"
      d="M15.787 22.5c-13.652-2.036-2.08-15.454 3.607-18.424-3.412-3.076-11.74-7.382-17.747 0-6.006 7.382 5.722 17.682 14.14 18.424Z"
    />
  </Svg>
)
export default Dialog
