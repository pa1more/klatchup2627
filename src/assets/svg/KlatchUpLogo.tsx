import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop, SvgProps} from 'react-native-svg';

const KlatchUpLogo = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path fill="url(#a)" d="M9 23.672v51.6l20.232-19.32L29.168 5 9 23.672Z" />
    <Path
      fill="url(#b)"
      d="M42.711 16.76h29.056l-18.88 18.664H41.2l-11.992.008-.008-3.56L42.711 16.76Z"
    />
    <Path
      fill="url(#c)"
      d="m40.584 35.424.024 20.528 20.4 19.168V50.528l-13.96-15.112-6.464.008Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={8.998}
        x2={29.232}
        y1={40.136}
        y2={40.136}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#6F431A" />
        <Stop offset={1} stopColor="#F48D1F" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={29.199}
        x2={71.769}
        y1={26.096}
        y2={26.096}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#6F431A" />
        <Stop offset={1} stopColor="#F48D1F" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={40.587}
        x2={61.008}
        y1={55.269}
        y2={55.269}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#6F431A" />
        <Stop offset={1} stopColor="#F48D1F" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default KlatchUpLogo;
