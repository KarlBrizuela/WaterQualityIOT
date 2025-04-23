import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { db, ref, onValue } from '../firebase'; // Adjust the path if necessary

export default function DashboardScreen({ navigation }) {
  const [sensorData, setSensorData] = useState({
    temperature: 'Loading...',
    tds: 'Loading...',
    turbidity: 'Loading...',  // Added turbidity
  });

  useEffect(() => {
    // Reference the 'water' node in your Firebase Realtime Database
    const waterRef = ref(db, 'water'); 

    const unsubscribe = onValue(waterRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Fetched data:', data);  // Log the fetched data from Firebase
      if (data) {
        setSensorData({
          temperature: data.temp ?? 'N/A',  // Use 'temp' from Firebase
          tds: data.tds ?? 'N/A',            // Use 'tds' from Firebase
          turbidity: data.turbidity ?? 'N/A',  // Use 'turbidity' from Firebase
        });
      } else {
        setSensorData({
          temperature: 'N/A',
          tds: 'N/A',
          turbidity: 'N/A',  // Set turbidity as N/A when data is unavailable
        });
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
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
        <Text style={styles.label}>Turbidity:</Text>
        <Text style={styles.value}>{sensorData.turbidity}</Text>
      </View>

      {/* Button to navigate to ManageDataScreen */}
      <Button
        title="Manage Data"
        onPress={() => {
          if (sensorData.temperature !== 'Loading...') {
            navigation.navigate('ManageDataScreen', { sensorData }); // Pass sensorData as a parameter
          } else {
            alert('Data is still loading...');
          }
        }}
      />
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