// ScreenWrapper.js
import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenWrapper({
  children,
  style,
  header,
  statusBarColor = 'transparent',
  barStyle = 'dark-content',
  scroll = false,
  showBackground = true,
}) {
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={statusBarColor} barStyle={barStyle} />

      {/* TOP BACKGROUND IMAGE */}
      {showBackground && (
        <Image
          source={require('../../assets/image.png')}
          style={styles.topBackground}
          resizeMode="cover"
        />
      )}

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        {/* HEADER SECTION */}
        {header && (
          <View style={styles.headerContainer}>
            {header}
          </View>
        )}

        {/* CONTENT SECTION */}
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.container, style]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.container, style]}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff', // Light background to see content better
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '30%', // Adjusted to 30%
    zIndex: 0,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10, // Reduced padding
    minHeight: 60, // Ensure header has minimum height
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 0, // Removed horizontal padding - let child components handle it
    paddingTop: 10, // Add top padding instead of negative margin
    paddingBottom: 20,
  },
});