import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeavyComponent from '../components/HeavyComponent';
import FooterComponent from '../components/FooterComponent';

export default function HeavyScreen() {
  return (
    <View style={styles.container}>
      <HeavyComponent />
      <FooterComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
