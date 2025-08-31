import React, { createContext, useContext, useState } from "react";
import { BleManager } from "react-native-ble-plx";

const BluetoothContext = createContext();
const manager = new BleManager();

export const BluetoothProvider = ({ children }) => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const DEVICE_NAME = "Glouv";

  const connectToDevice = async () => {
    try {
      console.log("Escaneando dispositivos...");
      manager.stopDeviceScan();

      const scanTimeout = setTimeout(() => {
        manager.stopDeviceScan();
        console.log("No se encontró el dispositivo después de 10s");
        alert("No se encontró el guante Glouv. Verifica que esté encendido y cerca.");
      }, 15000);

      manager.startDeviceScan(null, null, async (error, scannedDevice) => {
        if (error) {
          console.log("Error escaneando:", error);
          clearTimeout(scanTimeout);
          return;
        }

        console.log("Detectado:", scannedDevice?.name);

        if (scannedDevice?.name === DEVICE_NAME) {
          console.log("Encontrado:", scannedDevice.name);

          manager.stopDeviceScan();
          clearTimeout(scanTimeout);

          try {
            const connectedDevice = await scannedDevice.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();

            setDevice(connectedDevice);
            setIsConnected(true);
            console.log("🔗 Conectado a", connectedDevice.name);
          } catch (connectError) {
            console.log("Error al conectar:", connectError);
          }
        }
      });
    } catch (err) {
      console.log("Error general:", err);
    }
  };

  const disconnectFromDevice = async () => {
    if (device) {
      try {
        await device.cancelConnection();
        setDevice(null);
        setIsConnected(false);
        console.log("Desconectado del dispositivo");
      } catch (error) {
        console.log("Error al desconectar:", error);
      }
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        device,
        isConnected,
        connectToDevice,
        disconnectFromDevice,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);
