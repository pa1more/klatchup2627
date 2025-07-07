import * as React from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

const {height} = Dimensions.get('window');

interface Props {
  translateX: number
}

export default class KLeft extends React.Component<Props, {}> {
  render() {
    return (
      <Svg
        width={20}
        height={100}
        translateY={height / 2.3}
        translateX={this.props.translateX}
        fill="none">
        <Path
          fill="url(#a)"
          d="M.616 18.672v51.6l20.232-19.32L20.784 0 .616 18.672Z"
        />
        <Defs>
          <LinearGradient
            id="a"
            x1={0.614}
            x2={20.848}
            y1={35.136}
            y2={35.136}
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#6F431A" />
            <Stop offset={1} stopColor="#F48D1F" />
          </LinearGradient>
        </Defs>
      </Svg>
    );
  }
}
