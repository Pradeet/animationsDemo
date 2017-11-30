import { Dimensions, StyleSheet } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
	},
	modalContainer: {
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
	},
	imageOuterContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		alignItems: 'center',
		justifyContent: 'center',
	},
	imageContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
	},
	imageStyle: {
		flexGrow: 1,
		flexShrink: 1,
	},
	closeButton: {
		fontSize: 35,
		color: 'white',
		lineHeight: 40,
		width: 40,
		textAlign: 'center',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 1.5,
		shadowColor: 'black',
		shadowOpacity: 0.8,
		marginTop: 15,
	},
});
