import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from "react-native";

export default class Welcome extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<TouchableHighlight onPress={() => this.pushScreen('animated.parallel', 'Parallel Animations')} style={styles.buttonStyle}>
					<Text>Parallel Animations</Text>
				</TouchableHighlight>

				<TouchableHighlight onPress={() => this.pushScreen('animated.sequence', 'Sequence Animations')} style={styles.buttonStyle}>
					<Text>Sequence Animations</Text>
				</TouchableHighlight>

				<TouchableHighlight onPress={() => this.pushScreen('animated.stagger', 'Stagger Animations')} style={styles.buttonStyle}>
					<Text>Stagger Animations</Text>
				</TouchableHighlight>

				<TouchableHighlight onPress={() => this.pushScreen('animated.timing', 'Timing Animations')} style={styles.buttonStyle}>
					<Text>Timing Animations</Text>
				</TouchableHighlight>

				<TouchableHighlight onPress={() => this.pushScreen('animated.multiple.timing', 'Multiple Timing Animations')} style={styles.buttonStyle}>
					<Text>Multiple Timing Animations</Text>
				</TouchableHighlight>
			</View>
		)
	}

	pushScreen (screen, title) {
		this.props.navigator.push({
			screen,
			title
		});
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonStyle: {
		marginBottom: 30,
	}
});