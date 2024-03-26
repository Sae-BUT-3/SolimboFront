import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Colors } from '../../style/color';
import { Pressable, StyleSheet } from 'react-native';

const SelectFilter = ({props}) => {

  const handleChange = (event) => {
      props.setFiltre(event.target.value);
  };

  const handleSort = (event) => {
    props.setSort(event.target.value);
    if(event.target.value == 'like') props.changeReviews(true);
    };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
        props.setOpen(false);
    }
  };

  return (
    <Dialog disableEscapeKeyDown open={props.open} onClose={handleClose} sx={styles.container}>
    <DialogTitle>Selectionnez vos filtre</DialogTitle>
    <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <FormControl variant="filled" sx={{ m: 1, bgcolor: Colors.Onyx, color: Colors.White, width: 200 }} >
            <InputLabel sx={{ color: Colors.White}} >Fitrer les reviews</InputLabel>
            <Select value={props.filtre} onChange={handleChange} color={Colors.White}>
                <MenuItem value="" >Tous les reviews</MenuItem>
                <MenuItem value='album'>Par album</MenuItem>
                <MenuItem value='artist'>Par artiste</MenuItem>
            </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, bgcolor: Colors.Onyx, color: Colors.White, width: 200 }} >
            <InputLabel sx={{ color: Colors.White}} >Trier les reviews</InputLabel>
            <Select value={props.sort} onChange={handleSort} color={Colors.White}>
                <MenuItem value='like'>Par like</MenuItem>
            </Select>
        </FormControl>
    </Box>
    </DialogContent>
    <DialogActions>
        <Pressable onPress={handleClose} style={styles.button}><Text style={styles.filterText}>Annuler</Text></Pressable>
        <Pressable onPress={handleClose} style={[styles.button, {backgroundColor: Colors.SeaGreen}]}><Text style={styles.filterText}>Valider</Text></Pressable>
    </DialogActions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: Colors.Onyx,
  },
  button: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.Jet,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' ,
    transition: 'background-color 0.3s ease'
  },
  filterText: {
    fontWeight: 'bold',
    color: Colors.White,
  },
});

export default SelectFilter