import { Dimensions, StyleSheet } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
	imageContainer: {
		flexGrow: 1,
		maxWidth: WINDOW_WIDTH,
		backgroundColor: theme.colors.bg2,
	}
});
