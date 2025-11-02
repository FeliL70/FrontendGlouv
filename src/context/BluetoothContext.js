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

  const { user } = useAuth(); // obtenemos el id del usuario logueado
  const DEVICE_NAME = "Glouv";
  const SERVICE_UUID = "d1f1a340-2c47-11ee-be56-0242ac120002";
  const CHARACTERISTIC_UUID = "d1f1a341-2c47-11ee-be56-0242ac120002";
  const PORCENTAJE_BRAZO = 0.049;

  // -------------------
  // Funciones auxiliares
  // -------------------
  const fetchPerfil = async () => {
    try {
      const resp = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/perfil?id=${user.id}`);
      const data = await resp.json();
      return data; // { peso, id_tipoDeCuerpo }
    } catch (err) {
      console.log("Error obteniendo perfil:", err);
    }
  };

  const fetchTipoCuerpo = async (idTipo) => {
    try {
      const resp = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/tipoDeCuerpo?id=${idTipo}`);
      const data = await resp.json();
      return data; // { mult }
    } catch (err) {
      console.log("Error obteniendo tipoDeCuerpo:", err);
    }
  };

  // -------------------
  // Lectura BLE + cálculo fuerza
  // -------------------
const startNotifications = async (connectedDevice, peso, mult) => {
  connectedDevice.monitorCharacteristicForService(
    SERVICE_UUID,
    CHARACTERISTIC_UUID,
    (error, characteristic) => {
      if (error) {
        console.log("Error en monitorCharacteristic:", error);
        return;
      }

      if (characteristic?.value) {
    try {
  const buf = Buffer.from(characteristic.value, "base64");

  // Leer float en little endian (4 bytes típicos de float en Arduino)
  const aceleracion = buf.readFloatLE(0);

  if (!isNaN(aceleracion)) {
    const masaBrazo = peso * PORCENTAJE_BRAZO * mult;
    const fuerzaCalculada =  Math.round(masaBrazo * aceleracion);
    console.log("Aceleración:", aceleracion, "→ Fuerza:", fuerzaCalculada);
    setFuerza(fuerzaCalculada);
  } else {
    console.log("Float inválido:", buf);
  }
} catch (e) {
  console.log("Error procesando float:", e);
}
      }
    }
  );
};


  // -------------------
  // Conexión BLE
  // -------------------
  const connectToDevice = async () => {
    try {
      console.log("Escaneando dispositivos...");
      manager.startDeviceScan(null, null, async (error, scannedDevice) => {
        if (error) {
          console.log("Error escaneando:", error);
          return;
        }
        if (scannedDevice?.name === DEVICE_NAME) {
          manager.stopDeviceScan();
          try {
            const connectedDevice = await scannedDevice.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            setDevice(connectedDevice);
            setIsConnected(true);
            console.log("Conectado a", connectedDevice.name);

            // obtenemos datos del usuario y tipo de cuerpo
            const perfil = await fetchPerfil();
            const tipo = await fetchTipoCuerpo(perfil.id_tipoDeCuerpo);

            // arrancamos la lectura BLE
            startNotifications(connectedDevice, perfil.peso, tipo.mult);
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