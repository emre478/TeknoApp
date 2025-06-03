import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchProducts } from '../../Services/fetchProducts';

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchProducts();
      setProducts(result);
    };
    getData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.urun_adi} - {item.marka}</Text>
      <Text>Barkod: {item.id}</Text>
      <Text>Alış Fiyatı: {item.alis_fiyati} ₺</Text>
      <Text>Satış Fiyatı: {item.satis_fiyati} ₺</Text>
      <Text>Stok: {item.stok_miktari} adet</Text>
      <Text>Karbon Ayak İzi: {item.karbon_ayak_izi} kg CO₂</Text>
      <Text>Son Kullanma Tarihi: {item.son_kullanma_tarihi}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Ürün bulunamadı.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#f0f4f7',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
});

export default Dashboard;
