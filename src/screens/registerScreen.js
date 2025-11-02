import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import BotonRojo2 from '../components/botonRojo2';
import Imagen from '../../assets/GlouvChico.png';
import Separador from '../components/separador';

/**
 * SimpleDropdown: fallback 100% JS para reemplazar Picker nativo.
 * Props:
 *  - items: [{ id: '1', label: 'Argentina' }, ...]
 *  - selectedValue: id seleccionado (string o null)
 *  - onValueChange: fn(itemId)
 *  - placeholder: string
 */
function SimpleDropdown({ items = [], selectedValue, onValueChange, placeholder }) {
  const [open, setOpen] = useState(false);

  const labelFor = (val) => {
    const found = items.find((i) => String(i.id) === String(val));
    return found ? (found.label ?? found.pais ?? found.cuerpo ?? found.name ?? '(sin nombre)') : placeholder;
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.selector}
        activeOpacity={0.8}
      >
        <Text style={styles.selectorText}>{labelFor(selectedValue)}</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity style={styles.backdrop} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={styles.modal}>
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onValueChange(String(item.id));
                    setOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>
                    {item.label ?? item.pais ?? item.cuerpo ?? item.name ?? '(sin nombre)'}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [idPais, setIdPais] = useState(null);
  const [idTipoCuerpo, setIdTipoCuerpo] = useState(null);
  const [peso, setPeso] = useState('');

  const [paises, setPaises] = useState([]);
  const [tiposCuerpo, setTiposCuerpo] = useState([]);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pesoError, setPesoError] = useState('');

  const { setUser } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPaises, resCuerpos] = await Promise.all([
          fetch('https://wealthy-albacore-eminently.ngrok-free.app/api/paises'),
          fetch('https://wealthy-albacore-eminently.ngrok-free.app/api/tiposDeCuerpo'),
        ]);

        if (!resPaises.ok) console.warn('Fetch /api/paises returned status', resPaises.status);
        if (!resCuerpos.ok) console.warn('Fetch /api/tiposDeCuerpo returned status', resCuerpos.status);

        const parsedPaises = await safeJson(resPaises);
        const parsedCuerpos = await safeJson(resCuerpos);

        console.log('RESPUESTA /api/paises ->', parsedPaises);
        console.log('RESPUESTA /api/tiposDeCuerpo ->', parsedCuerpos);

        const paisesArray = normalizeToArray(parsedPaises, 'paises');
        const cuerposArray = normalizeToArray(parsedCuerpos, 'tiposDeCuerpo');

        const normalizedPaises = paisesArray
          .map((p) => ({
            id: String(p.id ?? p.ID ?? p.id_pais ?? p.key ?? ''),
            pais: p.pais ?? p.nombre ?? p.name ?? '',
            original: p,
          }))
          .filter((x) => x.id);

        const normalizedCuerpos = cuerposArray
          .map((t) => ({
            id: String(t.id ?? t.ID ?? t.id_tipoDeCuerpo ?? t.key ?? ''),
            cuerpo: t.cuerpo ?? t.nombre ?? t.name ?? '',
            original: t,
          }))
          .filter((x) => x.id);

        setPaises(normalizedPaises);
        setTiposCuerpo(normalizedCuerpos);

        if (normalizedPaises.length && !idPais) setIdPais(normalizedPaises[0].id);
        if (normalizedCuerpos.length && !idTipoCuerpo) setIdTipoCuerpo(normalizedCuerpos[0].id);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        Alert.alert('Error', 'Error al conectar con el servidor (ver consola)');
      }
    };

    fetchData();

    // helpers
    async function safeJson(response) {
      try {
        const text = await response.text();
        if (!text) return [];
        return JSON.parse(text);
      } catch (e) {
        console.warn('No se pudo parsear JSON o response vacío:', e);
        return [];
      }
    }

    function normalizeToArray(parsed, hintKey) {
      if (!parsed) return [];
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.data)) return parsed.data;
      if (Array.isArray(parsed[hintKey])) return parsed[hintKey];
      const keys = Object.keys(parsed || {});
      for (const k of keys) {
        if (Array.isArray(parsed[k])) return parsed[k];
      }
      if (typeof parsed === 'object' && Object.keys(parsed).length) return [parsed];
      return [];
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validateEmail = (value) => {
    if (!value.includes('@')) {
      setEmailError('El correo electrónico debe contener una arroba (@)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value) => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough || !hasUppercase || !hasNumber) {
      let msg = 'La contraseña debe tener:';
      if (!isLongEnough) msg += '\n• Al menos 8 caracteres';
      if (!hasUppercase) msg += '\n• Una letra mayúscula';
      if (!hasNumber) msg += '\n• Al menos un número';
      setPasswordError(msg);
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validatePeso = (value) => {
    const num = parseFloat(String(value).replace(',', '.'));
    if (isNaN(num) || num < 40 || num > 200) {
      setPesoError('El peso debe ser un número entre 40 y 200 kg');
      return false;
    }
    setPesoError('');
    return true;
  };

  const handleRegister = async () => {
    if (!email || !nombre || !password || !peso) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }

    if (!idPais || !idTipoCuerpo) {
      Alert.alert('Error', 'Por favor seleccioná país y tipo de cuerpo');
      return;
    }

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const pesoValid = validatePeso(peso);
    if (!emailValid || !passwordValid || !pesoValid) return;

    const payload = {
      email,
      nombreCompleto: nombre,
      Contrasenia: password,
      id_pais: isNaN(Number(idPais)) ? idPais : Number(idPais),
      id_tipoDeCuerpo: isNaN(Number(idTipoCuerpo)) ? idTipoCuerpo : Number(idTipoCuerpo),
      peso: parseFloat(String(peso).replace(',', '.')),
    };

    console.log('REGISTRO PAYLOAD ->', payload);

    try {
      const response = await fetch('https://wealthy-albacore-eminently.ngrok-free.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let result;
      try { result = JSON.parse(text); } catch (e) { result = text || {}; }

      console.log('RESPUESTA /api/register ->', response.status, result);

      if (response.ok) {
        if (result && result.usuario) {
          setUser(result.usuario);
        } else {
          setUser(result);
        }
        // navigation.navigate('Home'); // opcional
      } else {
        Alert.alert('Error', result.error || result.message || 'No se pudo registrar');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      Alert.alert('Error', 'Error de conexión con el servidor');
    }
  };

  return (
    <View style={{ backgroundColor: '#272727', flex: 1 }}>
      <View style={styles.registerScreen}>
        <View style={{ height: 25 }} />
        <Image source={Imagen} />
        <Text style={styles.text}>Registrarse con Glouv</Text>

        <TextInput
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
          style={styles.input}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TextInput
          placeholder="Peso (kg)"
          value={peso}
          onChangeText={(text) => {
            setPeso(text);
            validatePeso(text);
          }}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
          style={styles.input}
        />
        {pesoError ? <Text style={styles.errorText}>{pesoError}</Text> : null}

        {/* Dropdown Tipo de cuerpo */}
        <View style={styles.pickerContainer}>
          <SimpleDropdown
            items={tiposCuerpo.map((t) => ({ id: t.id, label: t.cuerpo }))}
            selectedValue={idTipoCuerpo}
            onValueChange={(v) => setIdTipoCuerpo(v)}
            placeholder="Seleccionar tipo de cuerpo"
          />
        </View>

        {/* Dropdown País */}
        <View style={styles.pickerContainer}>
          <SimpleDropdown
            items={paises.map((p) => ({ id: p.id, label: p.pais }))}
            selectedValue={idPais}
            onValueChange={(v) => setIdPais(v)}
            placeholder="Seleccionar país"
          />
        </View>

        <BotonRojo2 texto="Registrarse" onPress={handleRegister} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>¿Ya tenés cuenta? </Text>
          <Text
            style={{ color: '#FF3B30', fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Login')}
          >
            Iniciar sesión
          </Text>
        </View>

        <Separador colorS="white" mB={22.5} mT={22.5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  registerScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 25,
    marginTop: -50,
    marginBottom: 50,
    fontWeight: 'bold',
  },
  input: {
    paddingLeft: 20,
    height: 50,
    width: 332,
    borderColor: '#fff',
    marginBottom: 8,
    borderRadius: 60,
    backgroundColor: '#D9D9D9',
  },
  pickerContainer: {
    width: 332,
    backgroundColor: '#D9D9D9',
    borderRadius: 60,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'left',
    width: 332,
  },
  /* SimpleDropdown styles */
  selector: {
    width: 316, // deja padding horizontal del container
    height: 50,
    borderRadius: 60,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selectorText: {
    color: '#000',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    backgroundColor: '#fff',
    maxHeight: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
});