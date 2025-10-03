import React, { createContext, useContext, useState } from "react";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { useAuth } from "../context/AuthContext";

const BluetoothContext = createContext();
const manager = new BleManager();

export const BluetoothProvider = ({ children }) => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fuerza, setFuerza] = useState(null);

  const DEVICE_NAME = "Glouv";

  const { user } = useAuth();

  const SERVICE_UUID = "d1f1a340-2c47-11ee-be56-0242ac120002";
  const CHARACTERISTIC_UUID = "d1f1a342-2c47-11ee-be56-0242ac120002";

  const guardarGolpe = async (valorFuerza) => {
    try {
      const response = await fetch(
        `https://wealthy-albacore-eminently.ngrok-free.app/api/golpes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuarioEntrenamiento: user.id,
            fuerza: valorFuerza,
            id_guante: 1,
          }),
        }
      );

      if (!response.ok) {
        console.log("Error guardando golpe:", response.status);
      }
    } catch (error) {
      console.log("Error en guardarGolpe:", error);
    }
  };

  const startNotifications = async (connectedDevice) => {
    try {
      connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log("Error en monitorCharacteristic:", error);
            return;
          }

          if (characteristic?.value) {
            const decoded = Buffer.from(
              characteristic.value,
              "base64"
            ).toString("utf-8");

            const valor = parseInt(decoded.trim(), 10);

            if (!isNaN(valor)) {
              console.log("Dato recibido:", valor);
              setFuerza(valor);
              guardarGolpe(valor);
            }
          }
        }
      );
    } catch (err) {
      console.log("Error iniciando notificaciones:", err);
    }
  };

  const connectToDevice = async () => {
    try {
      console.log("Escaneando dispositivos...");
      manager.stopDeviceScan();

      const scanTimeout = setTimeout(() => {
        manager.stopDeviceScan();
        console.log("No se encontró el dispositivo después de 15s");
        alert(
          "No se encontró el guante Glouv. Verifica que esté encendido y cerca."
        );
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
            console.log("Conectado a", connectedDevice.name);

            startNotifications(connectedDevice);
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
        fuerza,
        connectToDevice,
        disconnectFromDevice,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => useContext(BluetoothContext);