import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useRoute, RouteProp } from '@react-navigation/native';

// Define the type for our route parameters
type ParamList = {
  Tab3: {
    myId?: string;
  };
};

export default function ThirdScreen() {
  const route = useRoute<RouteProp<ParamList, 'Tab3'>>();
  const myId = route.params?.myId;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Third Screen</Text>
      <Text style={styles.subtext}>
        {myId ? `Deep Link ID received: ${myId}` : 'No ID passed.'}
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
