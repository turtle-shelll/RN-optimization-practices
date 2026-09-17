import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function FourthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fourth Screen</Text>
      <Text style={styles.subtext}>
        Lightweight React Native Views.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
