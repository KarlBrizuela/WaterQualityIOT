import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const [sensorData, setSensorData] = useState({
    temperature: 26.5,  // Placeholder
    tds: 320,           // Placeholder
    waterLevel: 'High', // Placeholder
  });

  // Function to generate random data
  const generateSensorData = () => {
    const temperature = (25 + Math.random() * 5).toFixed(1);  // Random temperature between 25-30°C
    const tds = Math.floor(300 + Math.random() * 100);  // Random TDS between 300-400 ppm
    const waterLevel = Math.random() > 0.5 ? 'High' : 'Low'; // Random water level

    setSensorData({
      temperature,
      tds,
      waterLevel,
    });
  };

  // Update data every 5 seconds (simulate real-time sensor readings)
  useEffect(() => {
    const interval = setInterval(() => {
      generateSensorData();
    }, 5000);  // Every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
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
