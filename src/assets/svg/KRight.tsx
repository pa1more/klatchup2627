import * as React from 'react'
import {Dimensions} from 'react-native'
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg'

const {height} = Dimensions.get('window')

interface Props {
  translateX: number
}

export default class KRight extends React.Component<Props, {}> {
  render() {
    return (
      <Svg
        width={50}
        height={100}
        transform={[
          {rotateY: '0deg'},
          {translateY: height / 2.3 + 12},
          {translateX: this.props.translateX},
        ]}
        fill="none">
        <Path
          fill="url(#a)"
          d="M14.328.76h29.056l-18.88 18.664H12.816l-11.992.008-.008-3.56L14.328.76Z"
        />
        <Path
          fill="url(#b)"
          d="m12.2 19.424.024 20.528 20.4 19.168V34.528l-13.96-15.112-6.464.008Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={0.816}
            x2={43.386}
            y1={10.096}
            y2={10.096}
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#6F431A" />
            <Stop offset={1} stopColor="#F48D1F" />
          </LinearGradient>
          <LinearGradient
            id="b"
            x1={12.204}
            x2={32.624}
            y1={39.269}
            y2={39.269}
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#6F431A" />
            <Stop offset={1} stopColor="#F48D1F" />
          </LinearGradient>
        </Defs>
      </Svg>
    );
  }
}
