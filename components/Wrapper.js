import { ScrollView, View } from 'react-native';
import React, { useState, useRef } from 'react';
import GlobalStyle, { primaryBlue } from '../style';
import { CustomActionSheet } from './ActionSheet';
import FloatButton from './FloatButton';
import { LinearGradient } from 'react-native-linear-gradient'; // Or from 'react-native-linear-gradient' if not using Expo
import { useEffect } from 'react';

const Wrapper = ({
  children,
  handleBack,
  addPadding,
  showinvoicebtn,
  showClose = false,
  style = {},
  ...rest
}) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(null);
  const [contentHeight, setContentHeight] = useState(null);
  const scrollRef = useRef(null);

  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const bottomOffset = layoutMeasurement.height + contentOffset.y;
    setIsAtBottom(bottomOffset >= contentSize.height - 5);
  };

  useEffect(() => {
    if (layoutHeight !== null && contentHeight !== null) {
      setIsAtBottom(layoutHeight >= contentHeight - 5);
    }
  }, [layoutHeight, contentHeight]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: primaryBlue,
      }}>
      <CustomActionSheet
        handleBack={handleBack}
        showClose={showClose}
        style={style}
        {...rest}>
        <ScrollView
          onScroll={handleScroll}
          onLayout={event => {
            setLayoutHeight(event.nativeEvent.layout.height);
          }}
          onContentSizeChange={(width, height) => {
            setContentHeight(height);
          }}
          ref={scrollRef}
          scrollEventThrottle={16}>
          <View
            style={[
              GlobalStyle.container,
              {
                paddingHorizontal: addPadding ? 10 : 0,
              },
            ]}>
            {children}
          </View>
        </ScrollView>
        {!isAtBottom && (
          <LinearGradient
            colors={['#ffffff00', '#fff']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 100,
              height: 50, // You can adjust this value for larger or smaller gradient
            }}
          />
        )}
        {showinvoicebtn ? <FloatButton /> : null}
      </CustomActionSheet>
    </View>
  );
};

export default Wrapper;
