import React from 'react';
import { Dimensions, View, Modal, Platform, Image as RNImage, Animated, StatusBar, TouchableOpacity, Text, TouchableHighlight } from 'react-native';
import _isEmpty from 'lodash/isEmpty';

import Image from './TransformableImage';

import styles from './PhotoViewOverlay.style';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const STATUS_BAR_OFFSET = (Platform.OS === 'android' ? 25 : 0);

export default class PhotoViewOverlay extends React.Component {

  constructor(props) {
    super(props);

    this.actualImageSize = {};
    this.fullImageMeta = {};
    this.animationConfig = { tension: 5, friction: 5 };
		// this.animationConfig = { duration: 270, easing: Easing.linear };
    this.state = {
      resizeMode: 'cover',
      openVal: new Animated.Value(0),
      targetOpacity: 1,
      target: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
      },
      androidStyle: {}
    };
  }

  componentDidMount() {
    if (!_isEmpty(this.actualImageSize)) {
      return;
    }

    RNImage.getSize(this.props.source, (width, height) => {
      this.actualImageSize = { width, height };
      this.fullImageMeta = {
        x: this.getTargetX(),
        y: this.getTargetY(),
        width: this.getTargetWidth(),
        height: this.getTargetHeight()
      };
      this.setState({
        target: {
          x: this.fullImageMeta.x,
          y: this.fullImageMeta.y,
          width: this.fullImageMeta.width,
          height: this.fullImageMeta.height
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openPreview !== this.props.openPreview && nextProps.openPreview === true) {
      if (nextProps.enableAnimation) {
        this.initializeAnimation();
      } else {
        this.initializeBasicAnimation();
      }
    }
  }

  render() {
    const { openPreview, enableAnimation } = this.props;

    if (!openPreview) {
      return null;
    }

    return (
      <Modal visible={openPreview} transparent onRequestClose={this.onRequestClose}>
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" />
          {this.renderBackground()}
          <View style={styles.imageOuterContainer}>
            {enableAnimation ? this.renderContentWithAnimation() : this.renderContentWithoutAnimation()}
          </View>
          {this.renderHeader()}
        </View>
      </Modal>
    );
  }

  renderBackground = () => {
    const { backgroundColor } = this.props;
    const { openVal } = this.state;

    const animatedStyle = {
      opacity: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, this.state.targetOpacity] })
    };

    return (
      <TouchableHighlight undelayColor="transparent" onPress={this.onBackgroundPress}>
        <Animated.View style={[styles.container, { backgroundColor }, animatedStyle]} />
      </TouchableHighlight>
    );
  };

  renderContentWithAnimation = () => {
    const { source, imageMetaInitial: origin } = this.props;
    const { openVal, target, resizeMode, androidStyle } = this.state;

    let openStyle = [styles.imageContainer, {
      left: openVal.interpolate({ inputRange: [0, 1], outputRange: [origin.x, target.x] }),
      top: openVal.interpolate({ inputRange: [0, 1], outputRange: [origin.y, target.y] }),
      width: openVal.interpolate({ inputRange: [0, 1], outputRange: [origin.width, target.width] }),
      height: openVal.interpolate({ inputRange: [0, 1], outputRange: [origin.height, target.height] }),
    }];

    if (Platform.OS === 'android' && !_isEmpty(androidStyle)) {
      openStyle = [styles.imageContainer, androidStyle];
    }

    return (
      <Animated.View style={openStyle}>
        <Image
          key="source1"
          source={source}
          style={[styles.imageStyle]}
          resizeMode={resizeMode}
          resizeMethod="auto"
        />
      </Animated.View>
    );
  };

  renderContentWithoutAnimation = () => {
    const { source } = this.props;
    return (
      <View style={styles.imageContainer}>
        <Image
          key="source1"
          source={source}
          style={[styles.imageStyle]}
          resizeMode="contain"
          resizeMethod="auto"
          onViewTransformed={this.onImageTransformed}
        />
      </View>
    );
  };

  renderHeader = () => {
    const { renderHeader } = this.props;

    if (renderHeader) {
      return this.renderHeader(this.onClose);
    }

    return (
      <TouchableOpacity onPress={this.onClose}>
        <Text style={styles.closeTouchableHighlight}>×</Text>
      </TouchableOpacity>
    );
  };

// eslint-disable-next-line no-unused-vars
  onImageTransformed = ({ scale, translateX, translateY }) => {

  };

  onClose = () => {
    if (!this.props.enableAnimation) {
      if (this.props.onClose) {
        this.props.onClose();
      }
    }

    if (Platform.OS === 'android') {
      this.setState({
        resizeMode: 'cover',
        androidStyle: {}
      }, () => {
        Animated.spring(this.state.openVal, { toValue: 0, ...this.animationConfig }).start(() => {
          if (this.props.onClose) {
            this.props.onClose();
          }
        });
      });
    } else {
      Animated.spring(this.state.openVal, { toValue: 0, ...this.animationConfig }).start(() => {
        if (this.props.onClose) {
          this.props.onClose();
        }
      });
    }
  };

  onBackgroundPress = () => {} // Blocking onPress when overlay is visible.

  onRequestClose = () => {
    if (Platform.OS === 'android') {
      this.onClose();
    }
  };

  initializeAnimation = () => {
    Animated.spring(this.state.openVal, { toValue: 1, ...this.animationConfig }).start(() => {
      if (Platform.OS === 'android') {
        this.setState({
          resizeMode: 'contain',
          androidStyle: {
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            x: 0,
            y: 0
          }
        });
      }
    });
  };

  initializeBasicAnimation = () => {
    Animated.spring(this.state.openVal, { toValue: 1, ...this.animationConfig }).start();
  };

  getTargetHeight = () => {
    if (_isEmpty(this.actualImageSize)) {
      return WINDOW_HEIGHT - STATUS_BAR_OFFSET;
    }


    const { height, width } = this.actualImageSize;

    const measuredWidth = this.getTargetWidth();
    const measuredHeight = (height / width) * measuredWidth;

    if (measuredHeight > WINDOW_HEIGHT - STATUS_BAR_OFFSET) {
      return WINDOW_HEIGHT - STATUS_BAR_OFFSET;
    }
    return measuredHeight;
  };

  getTargetWidth = () => WINDOW_WIDTH;

  getTargetX = () => 0;

  getTargetY = () => {
    const y = (WINDOW_HEIGHT - STATUS_BAR_OFFSET) / 2 - (this.getTargetHeight() / 2);
    return y < 0 ? 0 : y;
  }
}

PhotoViewOverlay.propTypes = {
  source: RNImage.propTypes.source.isRequired,
  imageMetaInitial: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }),
  renderHeader: React.PropTypes.func,
  swipeToDismiss: React.PropTypes.bool,
  backgroundColor: React.PropTypes.string,
  openPreview: React.PropTypes.bool,
  enablePreview: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  enableAnimation: React.PropTypes.bool,
};

PhotoViewOverlay.defaultProps = {
  swipeToDismiss: true,
  backgroundColor: 'rgba(0,0,0,1)',
  openPreview: false,
  enablePreview: false,
  enableAnimation: false,
};
