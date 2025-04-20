import React, { createContext, useState, useEffect } from 'react';

export const SensorDataContext = createContext();

export const SensorDataProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({
    temperature: 26.5,
    tds: 320,
    waterLevel: 'High',
  });

  const [records, setRecords] = useState([]);

  const generateSensorData = () => {
    const newData = {
      id: Date.now().toString(),
      temperature: (25 + Math.random() * 5).toFixed(1),
      tds: Math.floor(300 + Math.random() * 100),
      waterLevel: Math.random() > 0.5 ? 'High' : 'Low',
    };

    setSensorData({
      temperature: newData.temperature,
      tds: newData.tds,
      waterLevel: newData.waterLevel,
    });

    setRecords(prev => [...prev, newData]);
  };

  useEffect(() => {
    const interval = setInterval(generateSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorDataContext.Provider value={{ sensorData, records, setRecords }}>
      {children}
    </SensorDataContext.Provider>
  );
};
