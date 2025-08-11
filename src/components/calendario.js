import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const Calendario = () => {
  return (
    <View style={styles.container}>
      <Calendar
             theme={{
                calendarBackground: '#BDBBBB',
                textSectionTitleColor: '#000',
                selectedDayBackgroundColor: '#ff0000',
                selectedDayTextColor: '#fff',
                todayTextColor: '#ff0000',
                dayTextColor: '#000',
                textDisabledColor: '#555',
                arrowColor: '000',
                monthTextColor: '000',
                indicatorColor: '000',
              }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#BDBBBB',
    borderRadius: 10, overflow: 'hidden'
  },
});

export default Calendario;
