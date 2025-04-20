import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { db, ref, onValue } from '../firebase'; // make sure the path is correct

export default function DashboardScreen({ navigation }) {
  const [sensorData, setSensorData] = useState({
    temperature: 'Loading...',
    tds: 'Loading...',
    waterLevel: 'Loading...',
  });

  useEffect(() => {
    const tempRef = ref(db, 'temperature');
    const tdsRef = ref(db, 'tds');
    const levelRef = ref(db, 'waterLevel');

    const unsubscribeTemp = onValue(tempRef, snapshot => {
      setSensorData(prev => ({ ...prev, temperature: snapshot.val() }));
    });

    const unsubscribeTDS = onValue(tdsRef, snapshot => {
      setSensorData(prev => ({ ...prev, tds: snapshot.val() }));
    });

    const unsubscribeLevel = onValue(levelRef, snapshot => {
      setSensorData(prev => ({ ...prev, waterLevel: snapshot.val() }));
    });

    return () => {
      unsubscribeTemp();
      unsubscribeTDS();
      unsubscribeLevel();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Water Quality Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Temperature:</Text>
        <Text style={styles.value}>{sensorData.temperature} °C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>TDS:</Text>
        <Text style={styles.value}>{sensorData.tds} ppm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Water Level:</Text>
        <Text style={styles.value}>{sensorData.waterLevel}</Text>
      </View>

      <Button title="Manage Data (CRUD)" onPress={() => navigation.navigate('Settings')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007aff',
  },
});
