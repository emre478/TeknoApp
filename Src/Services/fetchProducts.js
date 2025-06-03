import database from '@react-native-firebase/database';

export const fetchProducts = async () => {
  try {
    const snapshot = await database()
      .ref('/urunler')
      .once('value');

    const data = snapshot.val();
    if (!data) return [];

    // Verileri diziye çevir (barkod numarasını id olarak al)
    return Object.keys(data).map((barkod) => ({
      id: barkod,
      ...data[barkod]
    }));
  } catch (error) {
    console.error('Veri alınırken hata:', error);
    return [];
  }
};
