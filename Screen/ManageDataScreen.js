import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, ref, onValue } from '../firebase';

export default function ManageDataScreen() {
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedRecord, setEditedRecord] = useState({
    temp: '',
    tds: '',
    turbidity: '',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const sensorRef = ref(db, 'water');
      onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newRecord = {
            id: `${Date.now()}-${Math.random()}`,
            temp: data.temp || 'N/A',
            tds: data.tds || 'N/A',
            turbidity: data.turbidity || 'N/A',
          };

          setRecords((prevRecords) => {
            const updatedRecords = [...prevRecords, newRecord];
            saveRecordsToStorage(updatedRecords);
            return updatedRecords;
          });
        }
      });
    }, 2000);

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

    return () => clearInterval(interval);
  }, []);

  const saveRecordsToStorage = async (records) => {
    try {
      await AsyncStorage.setItem('records', JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save records to AsyncStorage:', error);
    }
  };

  const handleDelete = (id) => {
    const updated = records.filter((record) => record.id !== id);
    setRecords(updated);
    saveRecordsToStorage(updated);
  };

  const handleDeleteAll = async () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all records?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete All',
          onPress: async () => {
            setRecords([]);
            await AsyncStorage.removeItem('records');
          },
        },
      ]
    );
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.id === id);
    setEditedRecord(recordToEdit);
    setEditingIndex(id);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedRecords = records.map((record) =>
        record.id === editingIndex ? { ...record, ...editedRecord } : record
      );
      setRecords(updatedRecords);
      saveRecordsToStorage(updatedRecords);
      setEditingIndex(null);
      setEditedRecord({ temp: '', tds: '', turbidity: '' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data History (Realtime)</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text style={styles.recordText}>Temp: {item.temp}°C</Text>
            <Text style={styles.recordText}>TDS: {item.tds} ppm</Text>
            <Text style={styles.recordText}>Turbidity: {item.turbidity}</Text>
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
            value={editedRecord.temp}
            onChangeText={(text) => setEditedRecord({ ...editedRecord, temp: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="TDS"
            value={editedRecord.tds}
            onChangeText={(text) => setEditedRecord({ ...editedRecord, tds: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Turbidity"
            value={editedRecord.turbidity}
            onChangeText={(text) => setEditedRecord({ ...editedRecord, turbidity: text })}
          />
          <Button title="Save Changes" onPress={handleSaveEdit} />
          <Button title="Cancel" onPress={() => setEditingIndex(null)} color="red" />
        </View>
      )}

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
