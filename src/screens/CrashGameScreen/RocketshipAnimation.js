// import React, { useEffect, useRef } from 'react';
// import { Animated } from 'react-native';
// import Svg, { Circle, Path } from 'react-native-svg';

// const RocketshipAnimation = ({ onAnimationComplete }) => {
//   const translateY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(translateY, {
//       toValue: -400, // Adjust the value to control the animation height
//       duration: 3000, // Adjust the duration as needed
//       useNativeDriver: true,
//     }).start(() => {
//       // Animation completed callback
//       onAnimationComplete();
//     });
//   }, []);

//   return (
//     <Animated.View style={{ transform: [{ translateY }] }}>
//       <Svg width={100} height={100} viewBox="0 0 100 100">
//         {/* Rocket body */}
//         <Circle cx="50" cy="50" r="20" fill="gray" />

//         {/* Rocket flame */}
//         <Path
//           d="M50 80 C40 85, 60 85, 50 100"
//           fill="orange"
//         />
//       </Svg>
//     </Animated.View>
//   );
// };

// export default RocketshipAnimation;