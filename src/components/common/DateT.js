import React, { useEffect, useState } from 'react';
import { Platform, Text } from 'react-native';
import { Colors } from '../../style/color';

const DateT = ({ dateString }) => {
 const [date, setDate] = useState(null)
 useEffect(() => {
    if(dateString != null) {
      const date = new Date(dateString);
      const maintenant = new Date();
      const differenceTemps = maintenant - date;

      // Comparer l'année, le mois, et le jour
      if (
        date.getFullYear() === maintenant.getFullYear() &&
        date.getMonth() === maintenant.getMonth() &&
        date.getDate() === maintenant.getDate()
      ) {
        // Si la date est aujourd'hui
        const differenceHeures = maintenant.getHours() - date.getHours();
        if (differenceHeures === 0) {
          // Si la date est dans la même heure
          const differenceMinutes = maintenant.getMinutes() - date.getMinutes();
          setDate(`${differenceMinutes} min`);
        } else {
          // Si la date est dans la même journée mais à une heure différente
          setDate(`${differenceHeures} h`);
        }
      } else if (differenceTemps < 24 * 60 * 60 * 1000) {
        // Si la date est hier ou aujourd'hui mais à une heure différente
        setDate('Hier');
      } else if (differenceTemps < 7 * 24 * 60 * 60 * 1000) {
        // Si la date est dans la semaine écoulée
        const differenceJours = Math.floor(
          differenceTemps / (24 * 60 * 60 * 1000)
        );
        setDate(`${differenceJours} j`);
      } else {
        // Si la date est ancienne, retourner le format "dd/mm/aaaa"
        const jour = ('0' + date.getDate()).slice(-2);
        const mois = ('0' + (date.getMonth() + 1)).slice(-2);
        const annee = date.getFullYear();
        setDate(`${jour}/${mois}/${annee}`);
      }
    }
  }, [dateString]);

  return (
    <Text style={{ color: Colors.White, fontSize: Platform.OS == 'web' ? 20 : 19, fontWeight: 'normal' }}>
      {date}
    </Text>
  );
};

export default DateT;
