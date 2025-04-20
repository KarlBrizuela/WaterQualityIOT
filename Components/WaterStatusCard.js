// src/components/WaterStatusCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WaterStatusCard({ title, value, unit }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {value} {unit}
      </Text>
    </View>
  );
}
//water Quality 
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    color: '#007AFF',
  },
});
