import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Heavy work: 1000 objects with real computation
// This runs when the module is first evaluated/required
const generateHeavyData = () => {
  const items: { id: number; label: string; score: number }[] = [];
  for (let i = 0; i < 1000; i++) {
    let score = 0;
    for (let j = 0; j < 300; j++) {
      score = (score + Math.sqrt(i * j + 1)) % 100000;
    }
    items.push({ id: i, label: `Record ${i}`, score: Math.round(score) });
  }
  return items;
};

const HEAVY_DATA = generateHeavyData();

const HeavyComponent = () => {
  useEffect(() => {
    console.log(`[HeavyComponent] Mounted — rendered ${HEAVY_DATA.length} items`);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ HeavyComponent ({HEAVY_DATA.length} records)</Text>
      <Text style={styles.subtitle}>
        This component computed 1000 records with 300 iterations each at module load time.
      </Text>
      <View style={styles.grid}>
        {HEAVY_DATA.slice(0, 120).map((item) => (
          <View key={item.id} style={styles.cell}>
            <Text style={styles.cellText}>{item.id}</Text>
            <Text style={styles.cellScore}>{item.score}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>Showing first 120 of 1000 items</Text>
    </View>
  );
};

export default HeavyComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
    lineHeight: 17,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  cell: {
    width: 48,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cellText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  cellScore: {
    fontSize: 8,
    color: '#64748b',
  },
  note: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});
