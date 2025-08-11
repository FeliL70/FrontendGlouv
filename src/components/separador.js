import { View, StyleSheet } from 'react-native';

export default function Separator({colorS, mB, mT}) {
  return (
   <View style={[styles.separator,  {backgroundColor: colorS, marginBottom: mB, marginTop: mT} ]} />
  );
}


const styles = StyleSheet.create({
  separator: {
    height: 1,
    opacity: 0.4,
    width: '90%',
  },
});