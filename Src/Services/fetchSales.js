import database from '@react-native-firebase/database';

export const fetchSales = async () => {
  try {
    const snapshot = await database().ref('/satislar').once('value');
    const data = snapshot.val();

    if (!data) {
      return [];
    }

    const salesList = [];
   
    Object.keys(data).forEach(date => {
      const salesOnDate = data[date];
      
      Object.keys(salesOnDate).forEach(saleId => {
        salesList.push({
          id: saleId,
          ...salesOnDate[saleId],
          satis_tarihi: date, 
        });
      });
    });

    return salesList;
  } catch (error) {
    console.error('Satış verileri alınırken hata:', error);
    return [];
  }
};
