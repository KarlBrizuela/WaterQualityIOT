import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function ManageDataScreen() {
  const [records, setRecords] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [tds, setTds] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to generate random sensor data
  const generateSensorData = () => {
    const temperature = (25 + Math.random() * 5).toFixed(1);  // Random temperature between 25-30°C
    const tds = Math.floor(300 + Math.random() * 100);  // Random TDS between 300-400 ppm
    const waterLevel = Math.random() > 0.5 ? 'High' : 'Low'; // Random water level

    const newRecord = {
      id: Date.now().toString(),
      temperature,
      tds,
      waterLevel,
    };

    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  // Automatically generate data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      generateSensorData();
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);  // Clear the interval when the component unmounts
  }, []);

  // Handle adding or updating a record
  const handleAddOrUpdate = () => {
    if (!temperature || !tds || !waterLevel) {
      Alert.alert('All fields are required');
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      temperature,
      tds,
      waterLevel,
    };

    if (editingIndex !== null) {
      const updated = [...records];
      updated[editingIndex] = { ...updated[editingIndex], ...newRecord };
      setRecords(updated);
    } else {
      setRecords([...records, newRecord]);
    }

    clearForm();
  };

  // Clear the form for adding/updating data
  const clearForm = () => {
    setTemperature('');
    setTds('');
    setWaterLevel('');
    setEditingIndex(null);
  };

  // Handle editing a record
  const handleEdit = (index) => {
    const item = records[index];
    setTemperature(item.temperature);
    setTds(item.tds);
    setWaterLevel(item.waterLevel);
    setEditingIndex(index);
  };

  // Handle deleting a record
  const handleDelete = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    clearForm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Sensor Records</Text>

      <TextInput
        style={styles.input}
        placeholder="Temperature (°C)"
        keyboardType="numeric"
        value={temperature}
        onChangeText={setTemperature}
      />
      <TextInput
        style={styles.input}
        placeholder="TDS (ppm)"
        keyboardType="numeric"
        value={tds}
        onChangeText={setTds}
      />
      <TextInput
        style={styles.input}
        placeholder="Water Level (High/Low)"
        value={waterLevel}
        onChangeText={setWaterLevel}
      />

      <Button
        title={editingIndex !== null ? 'Update Record' : 'Add Record'}
        onPress={handleAddOrUpdate}
      />

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.record}>
            <Text style={styles.recordText}>Temp: {item.temperature}°C</Text>
            <Text style={styles.recordText}>TDS: {item.tds} ppm</Text>
            <Text style={styles.recordText}>Level: {item.waterLevel}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editBtn}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteBtn}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  record: {
    backgroundColor: '#f1f8e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#81c784',
    padding: 8,
    borderRadius: 5,
  },
  deleteBtn: {
    backgroundColor: '#e57373',
    padding: 8,
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
