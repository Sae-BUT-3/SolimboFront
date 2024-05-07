import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Platform} from 'react-native';
import { Colors } from '../../style/color';
import Track from './Track';
import { DataTable, PaperProvider } from 'react-native-paper';

const numberOfItemsPerPageList = [2];

const Trackgraphy = ({ items}) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  useEffect(() => {
    setPage(0);
  }, []);

  return (
    items && (
    <PaperProvider>
    <DataTable  style={{paddingTop: 30, marginBottom: 30}}>                 
      {items.slice(page * itemsPerPage, (page * itemsPerPage) + itemsPerPage).map((item, index) => (
          <DataTable.Row key={index} style={{marginLeft: 0, borderBottomWidth: 0, marginBottom: 15}}>
              <DataTable.Cell>
                  <Track key={index} data={item}/> 
              </DataTable.Cell>
          </DataTable.Row>
      )) }
      { items.length > 3 && <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / 3)}
        onPageChange={(page) => setPage(page)}
        numberOfItemsPerPage={itemsPerPage}
        showFastPaginationControls
        style={{backgroundColor: Colors.Jet}}
      />}
    </DataTable>
    </PaperProvider>)
  );
}
const styles = StyleSheet.create({
  sectionFilter: {
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginBottom: 30,
    marginTop: 10
  },
  buttonText: {
    color: Colors.White,
    fontWeight: 'normal',
    textAlign: 'right',
  },
  filterButton: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.Jet,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
    transition: 'background-color 0.3s ease'
  },
  btnHovered: {
    backgroundColor: Colors.Onyx,
  },
  filterText: {
    fontWeight: 'bold',
    color: Colors.White,
    fontSize: 15
  },
  btn: {
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 9,
    borderColor: Colors.SeaGreen,
    borderWidth: 1,
    backgroundColor:  'transparent',
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 3 : 0, 
  },
});
export default Trackgraphy