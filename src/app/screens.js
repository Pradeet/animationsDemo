import { Navigation } from 'react-native-navigation';

import AnimatedParallel from '../pages/AnimatedParallel';

export function registerScreens() {
	Navigation.registerComponent('animated.parallel', () => AnimatedParallel);
}