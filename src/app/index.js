import { Navigation } from 'react-native-navigation';
import { registerScreens } from "./screens";

registerScreens();

Navigation.startSingleScreenApp({
	screen: {
		screen: 'welcome.list',
		title: 'Welcome',
		navigatorStyle: {
			navBarHidden: true,
		},
		navigatorButtons: {}
	},
});