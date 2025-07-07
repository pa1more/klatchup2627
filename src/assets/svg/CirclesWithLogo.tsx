import * as React from 'react';
import Svg, {G, Circle, ForeignObject} from 'react-native-svg'
import {Dimensions, StyleProp, ViewStyle} from 'react-native'
import KlatchUpLogo from './KlatchUpLogo';

const {width, height} = Dimensions.get('window')

const w = width / 2;
const h = height / 2 - 80;

const stroke = 30

interface Props {
  circules: number
  style: StyleProp<ViewStyle>
}

export default class SvgCircle extends React.Component<Props, {}> {
  render() {
    return (
      <Svg style={this.props.style} fill="none">
        {Array.apply(0, Array(this.props.circules | 0)).map(function (x, i) {
          return (
            <G filter="url(#a)" opacity={0.7 - 0.1 * i}>
              <Circle cx={w} cy={h} r={70 + stroke * i} fill="#4D1469" />
            </G>
          );
        })}
        <ForeignObject x={'40%'} y={'37.5%'}>
          <KlatchUpLogo />
        </ForeignObject>
      </Svg>
    )
  }
}
