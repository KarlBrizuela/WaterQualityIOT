import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { db, ref, onValue } from '../firebase'; // Ensure the correct path for firebase

export default function ManageDataScreen() {
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedRecord, setEditedRecord] = useState({
    temperature: '',
    tds: '',
    waterLevel: '',
  });

  // Fetch live data every 2 seconds and add it to records
  useEffect(() => {
    const interval = setInterval(() => {
      const sensorRef = ref(db, '/');
      onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newRecord = {
            id: `${Date.now()}-${Math.random()}`,  // Create a unique ID with timestamp + random number
            temperature: data.temperature || 'N/A',
            tds: data.tds || 'N/A',
            waterLevel: data.waterLevel || 'N/A',
          };

          // Add the new record to the list and save it to AsyncStorage
          setRecords((prevRecords) => {
            const updatedRecords = [...prevRecords, newRecord];
            saveRecordsToStorage(updatedRecords);  // Save updated records to AsyncStorage
            return updatedRecords;
          });
        }
      });
    }, 2000);

    // Fetch records from AsyncStorage when the screen is loaded
    const fetchRecordsFromStorage = async () => {
      try {
        const savedRecords = await AsyncStorage.getItem('records');
        if (savedRecords) {
          setRecords(JSON.parse(savedRecords));
        }
      } catch (error) {
        console.error('Failed to load records from AsyncStorage:', error);
      }
    };

    fetchRecordsFromStorage();

    return () => clearInterval(interval); // Cleanup
  }, []);

  // Function to save records to AsyncStorage
  const saveRecordsToStorage = async (records) => {
    try {
      await AsyncStorage.setItem('records', JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save records to AsyncStorage:', error);
    }
  };

  // Function to handle deleting a record by id
  const handleDelete = (id) => {
    const updated = records.filter((record) => record.id !== id);  // Use the id to filter out the deleted record
    setRecords(updated);
    saveRecordsToStorage(updated);  // Save updated list after deletion
  };

  // Function to handle deleting all records
  const handleDeleteAll = async () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all records?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Delete All',
          onPress: async () => {
            setRecords([]); // Clear the records state
            await AsyncStorage.removeItem('records'); // Clear AsyncStorage
            console.log('All records deleted!');
          },
        },
      ]
    );
  };

  // Function to handle editing a record
  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.id === id);
    setEditedRecord(recordToEdit);
    setEditingIndex(id);
  };

  // Function to handle saving edited record
  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedRecords = records.map((record) =>
        record.id === editingIndex ? { ...record, ...editedRecord } : record
      );
      setRecords(updatedRecords);

      // Save updated records to AsyncStorage
      saveRecordsToStorage(updatedRecords);

      setEditingIndex(null);
      setEditedRecord({ temperature: '', tds: '', waterLevel: '' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data History (Realtime)</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}  // Use unique id generated from timestamp + random number
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text style={styles.recordText}>Temp: {item.temperature}°C</Text>
            <Text style={styles.recordText}>TDS: {item.tds} ppm</Text>
            <Text style={styles.recordText}>Level: {item.waterLevel}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.editBtn}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ marginTop: 20 }}
      />

      {editingIndex !== null && (
        <View style={styles.editForm}>
          <Text style={styles.formTitle}>Edit Record</Text>
          <TextInput
            style={styles.input}
            placeholder="Temperature"
            value={editedRecord.temperature}
            onChangeText={(text) => setEditedRecord({ ...editedRecord, temperature: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="TDS"
            value={editedRecord.tds}
            onChangeText={(text) => setEditedRecord({ ...editedRecord, tds: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Water Level"
            value={editedRecord.waterLevel}
            onChangeText={(text) => setEditedRecord({ ...editedRecord, waterLevel: text })}
          />
          <Button title="Save Changes" onPress={handleSaveEdit} />
          <Button title="Cancel" onPress={() => setEditingIndex(null)} color="red" />
        </View>
      )}

      {/* Button to Delete All Data */}
      <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteAllBtn}>
        <Text style={styles.actionText}>Delete All Data</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#ffeb3b',
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
    textAlign: 'center',
  },
  editForm: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#007aff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  deleteAllBtn: {
    backgroundColor: '#e57373',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
});
