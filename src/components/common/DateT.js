import React, { useEffect, useState } from 'react';
import { Platform, Text, StyleSheet } from 'react-native';
import { Colors } from '../../style/color';

const DateT = ({ dateString }) => {
  const [displayDate, setDisplayDate] = useState(null);

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const timeDifference = now - date;

      const isSameDay = date.getFullYear() === now.getFullYear() &&
                        date.getMonth() === now.getMonth() &&
                        date.getDate() === now.getDate();

      if (isSameDay) {
        const hoursDifference = now.getHours() - date.getHours();
        if (hoursDifference === 0) {
          const minutesDifference = now.getMinutes() - date.getMinutes();
          setDisplayDate(`${minutesDifference} min`);
        } else {
          setDisplayDate(`${hoursDifference} h`);
        }
      } else if (timeDifference < 24 * 60 * 60 * 1000) {
        setDisplayDate('Hier');
      } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
        const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
        setDisplayDate(`${daysDifference} j`);
      } else {
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        setDisplayDate(`${day}/${month}/${year}`);
      }
    }
  }, [dateString]);

  return (
    <Text style={styles.dateText}>
      {displayDate}
    </Text>
  );
};

const styles = StyleSheet.create({
  dateText: {
    color: Colors.White,
    fontSize: Platform.OS === 'web' ? 20 : 19,
    fontWeight: 'normal',
  },
});

export default DateT;
