import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Truly heavy simulated work: create 800 structured items with calculation
const generateHeavyData = () => {
  const items = [];
  for (let i = 0; i < 800; i++) {
    // Artificial CPU work to simulate complex data processing
    let hash = 0;
    for (let j = 0; j < 500; j++) {
      hash = (hash + (i * j)) % 100000;
    }
    items.push({ id: i, label: `Data Record #${i + 1}`, hash });
  }
  return items;
};

const heavyData = generateHeavyData();

const HeavyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Heavy Component (800 Complex Nodes)</Text>
      <Text style={styles.subtitle}>
        This component renders 800 styled child views with CPU computations.
      </Text>

      <View style={styles.grid}>
        {heavyData.map((item) => (
          <View key={item.id} style={styles.cell}>
            <Text style={styles.cellTitle}>Item {item.id}</Text>
            <Text style={styles.cellHash}>hash: {item.hash}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HeavyComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxHeight: 280,
  },
  cell: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    padding: 6,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cellTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  cellHash: {
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});
