import { Navigation } from 'react-native-navigation';

import AnimatedParallel from '../pages/AnimatedParallel';
import AnimatedSequence from '../pages/AnimatedSequence';
import AnimatedStagger from '../pages/AnimatedStagger';
import AnimatedTiming from '../pages/AnimatedTiming';
import AnimatedMultipleTiming from '../pages/AnimatedMultipleTiming';
import Welcome from '../pages/Welcome';

export function registerScreens() {
	Navigation.registerComponent('welcome.list', () => Welcome);
	Navigation.registerComponent('animated.parallel', () => AnimatedParallel);
	Navigation.registerComponent('animated.sequence', () => AnimatedSequence);
	Navigation.registerComponent('animated.stagger', () => AnimatedStagger);
	Navigation.registerComponent('animated.timing', () => AnimatedTiming);
	Navigation.registerComponent('animated.multiple.timing', () => AnimatedMultipleTiming);
}