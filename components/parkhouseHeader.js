import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  Animated,
  Image,
  Dimensions,
  PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import GlobalStyle from '../style';
import { formatDate } from '../helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define some parkhouse header related size variables
const WINDOW_WIDTH = Dimensions.get('window').width;
const HEADER_MAX_HEIGHT = (WINDOW_WIDTH / 16) * 9;
let HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 50 : 56;
if (Platform.isPad) {
  HEADER_MIN_HEIGHT = 44;
}
const ratio = PixelRatio.getFontScale();
const realFontScale = 1 - (ratio - 1);
const correctFontScale = 1 + (1 - ratio) * 2;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

/**
 * Renders a progress bar for the provided percentage
 *
 * @class ProgressBar
 * @extends {Component}
 */
class ProgressBar extends Component {
  static propTypes = {
    percent: PropTypes.number,
  };

  render() {
    const { percent, opacity } = this.props;
    const progressStyle = { height: 15, opacity: opacity };
    return (
      <Animated.View
        style={[
          GlobalStyle.statsOuterPillBig,
          GlobalStyle.w100,
          progressStyle,
        ]}>
        <View style={[GlobalStyle.statsInnerPill, { width: percent + '%' }]} />
      </Animated.View>
    );
  }
}

/**
 * Renders the parkhouse header with name, picture and percentage of usage
 *
 * @class ParkhouseHeader
 * @extends {Component}
 */
export default function ({ item, height }) {
  const insets = useSafeAreaInsets();
  //HEADER_SCROLL_DISTANCE = HEADER_SCROLL_DISTANCE - insets.top;
  const NEW_HEADER_SCROLL_DISTANCE = HEADER_SCROLL_DISTANCE - insets.top;
  // Can use parkhouse from redux store. Will rerender when fetch is finished
  if (item == null || typeof height === typeof undefined) {
    return null;
  }
  // Calculate the percentage of car lot usage
  let percent = 100 - (item.free / item.capacity) * 100;
  // Check if the parkhouse has got a message attached
  const hasMessage = typeof item.message !== typeof undefined;
  // Initialize some animated variables which transform, move or scale the header and title
  const headerTranslate = height.interpolate({
    inputRange: [0, NEW_HEADER_SCROLL_DISTANCE],
    outputRange: [0, -NEW_HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });
  const opacity = height.interpolate({
    inputRange: [0, NEW_HEADER_SCROLL_DISTANCE / 2, NEW_HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
  });
  const imageTranslate = height.interpolate({
    inputRange: [0, NEW_HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });
  const titleScale = height.interpolate({
    inputRange: [0, NEW_HEADER_SCROLL_DISTANCE / 2, NEW_HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.8],
    extrapolate: 'clamp',
  });
  let titleTranslateY = HEADER_MIN_HEIGHT / 2 / 0.8;
  if (Platform.isPad) {
    titleTranslateY += insets.top;
  }
  if (isIphoneX() || Platform.isPad) {
    titleTranslateY -= 1;
  }
  // eslint-disable-next-line eqeqeq
  if (!(!hasMessage || item.free == 0 || !!item.full)) {
    titleTranslateY -= 15;
  }
  // if(ratio > 1 && !(correctFontScale < 0)) {
  //   titleTranslateY = titleTranslateY / (1 - (1 - realFontScale) / 3);
  // }
  if (correctFontScale > 1.3) {
    percent = 1.3 / correctFontScale;
    titleTranslateY = titleTranslateY / percent;
  }
  if (correctFontScale < 0.53) {
    titleTranslateY = titleTranslateY * (1 - (1 - realFontScale) / 3);
  }
  const titleTranslate = height.interpolate({
    inputRange: [0, NEW_HEADER_SCROLL_DISTANCE / 2, NEW_HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, titleTranslateY],
    extrapolate: 'clamp',
  });
  const titleTranslateLeft = height.interpolate({
    inputRange: [0, NEW_HEADER_SCROLL_DISTANCE / 2, NEW_HEADER_SCROLL_DISTANCE],
    outputRange: [
      0,
      0,
      Platform.OS === 'ios' ? (-WINDOW_WIDTH * 0.2) / 2 + 20 : 0,
    ],
    extrapolate: 'clamp',
  });

  // Renders a mix of animated views and texts which transform while scrolling vertically
  // Based on the data like message, currently free parking lots and so on the parkhouse header is rendered differently
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        GlobalStyle.headerWrapper,
        {
          height: HEADER_MAX_HEIGHT,
          transform: [{ translateY: headerTranslate }],
        },
      ]}>
      <Animated.View
        style={[
          GlobalStyle.backgroundImage,
          {
            opacity: opacity,
            height: HEADER_MAX_HEIGHT,
            transform: [{ translateY: imageTranslate }],
          },
        ]}>
        <Image
          style={GlobalStyle.container}
          source={{ uri: item.hero_image }}
        />
      </Animated.View>
      <Animated.View style={[GlobalStyle.headerContent]}>
        <View style={GlobalStyle.headerContentContainer}>
          <Animated.View
            style={[
              GlobalStyle.animatedHeaderText,
              {
                transform: [
                  { translateY: titleTranslate },
                  { translateX: titleTranslateLeft },
                  { scale: titleScale },
                ],
              },
            ]}>
            <Text
              style={[
                GlobalStyle.parkhouseTitle,
                GlobalStyle.parkhouseTitleTop,
              ]}>
              {item.title}
            </Text>
            <Animated.Text
              style={[GlobalStyle.parkhouseSubTitle, { opacity: opacity }]}>
              Aktualisiert: {formatDate(item.changed)}
            </Animated.Text>
          </Animated.View>
          {(!hasMessage || item.free == 0 || !!item.full) && (
            <Animated.View
              style={[
                GlobalStyle.animatedNumbers,
                {
                  opacity: opacity,
                },
              ]}>
              {item.free != 0 && !item.full && (
                <Text
                  style={[
                    GlobalStyle.parkhouseTitle,
                    GlobalStyle.parkhouseTitleBig,
                    GlobalStyle.mr5,
                  ]}>
                  {item.free}
                </Text>
              )}
              {item.free != 0 &&
                !item.full &&
                (item.trend === 'up' || item.trend === 'down') && (
                  <Icon
                    size={54}
                    style={{
                      marginTop: 4,
                      color: item.trend === 'up' ? '#A7BD4F' : '#e41312',
                    }}
                    name={'arrow-' + item.trend}
                  />
                )}
              {item.free != 0 &&
                !item.full &&
                item.trend !== 'up' &&
                item.trend !== 'down' && (
                  <Icon
                    size={54}
                    style={{ marginTop: 4, color: '#ebba13' }}
                    name="arrow-forward"
                  />
                )}
            </Animated.View>
          )}
        </View>
        {(!hasMessage || item.free == 0 || !!item.full) && (
          <ProgressBar percent={percent} opacity={opacity} />
        )}
      </Animated.View>
    </Animated.View>
  );
}
