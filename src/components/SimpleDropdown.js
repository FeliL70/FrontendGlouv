import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform
} from 'react-native';

export default function SimpleDropdown({ items = [], selectedValue, onValueChange, placeholder }) {
  const [open, setOpen] = useState(false);

  const labelFor = (val) => {
    const found = items.find(i => String(i.id) === String(val));
    return found ? (found.label ?? found.pais ?? found.cuerpo ?? found.name ?? '(sin nombre)') : placeholder;
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.selector}
        activeOpacity={0.7}
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
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    width: 332,
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
    borderBottomWidth: 0.3,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});