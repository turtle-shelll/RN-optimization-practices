import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeavyComponent from '../components/HeavyComponent';
import FooterComponent from '../components/FooterComponent';
import { NativeCustomButton } from '../components/NativeCustomButton';
import { Alert } from 'react-native';

export default function HeavyScreen() {
  return (
    <View style={styles.container}>
      <HeavyComponent />

      {/* 4. Rendering our pure Native Component! */}
      <NativeCustomButton
        style={{ width: '80%', height: 60, marginVertical: 20, alignSelf: 'center' }}
        text="Click Me (Native Button!)"
        color="#8a8c85ff" // React Native passes this Hex code natively!
        onCustomClick={(msg) => {
          Alert.alert("Native Event Fired!", msg);
        }}
      />

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
