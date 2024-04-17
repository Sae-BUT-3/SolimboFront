import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider } from 'react-native-paper';

const Confirmation = ({visible, message, handlePress}) => {
    const [open, setVisible] = React.useState(false);
    
    const hideDialog = () => setVisible(false);
    
    React.useEffect( ()=>{setVisible(visible)},[visible]);

    return (
      <PaperProvider>
        <View>
          <Portal>
            <Dialog visible={open} onDismiss={hideDialog}>
                <Dialog.Icon icon="alert" />
              <Dialog.Title>Confirmation</Dialog.Title>
              <Dialog.Content>
                <Text>{message}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Pressable onPress={()=>{hideDialog(); handlePress()}}><Text>Valider</Text></Pressable>
                <Pressable onPress={hideDialog}><Text>Annuler</Text></Pressable>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </PaperProvider>
    );
  };

export default Confirmation;