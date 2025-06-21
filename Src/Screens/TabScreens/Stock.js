import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchProducts } from '../../Services/fetchProducts';

export default function Stock() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLowStockProducts = async () => {
      const products = await fetchProducts();
      const filtered = products.filter(
        (product) => product.stok_miktari !== undefined && product.stok_miktari <= 70
      );
      setLowStockProducts(filtered);
      setLoading(false);
    };
    getLowStockProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Stok verileri yükleniyor....</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Stok Seviyesi Düşük Ürünler</Text>
        <Text style={styles.summaryValue}>{lowStockProducts.length} ürün</Text>
      </View>
      {lowStockProducts.length === 0 ? (
        <View style={styles.center}>
          <Text>Tüm ürünlerin stoğu yeterli.</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell, {flex:2}]}>Ürün Adı</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Stok</Text>
          </View>
          {lowStockProducts.map((product) => (
            <View key={product.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, {flex:2}]}>{product.urun_adi || product.id}</Text>
              <Text style={[styles.tableCell, {color: product.stok_miktari <= 20 ? '#F44336' : '#FFA726'}]}>{product.stok_miktari}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 8,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
});