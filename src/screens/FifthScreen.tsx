import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function FifthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fifth Screen</Text>
      <Text style={styles.subtext}>
        Last dummy screen.
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
