import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchProducts } from '../../Services/fetchProducts';

export default function Stock() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringSoonProducts, setExpiringSoonProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStockData = async () => {
      const products = await fetchProducts();
      
      // Stok seviyesi filtresi
      const lowStock = products.filter(
        (p) => p.stok_miktari !== undefined && p.stok_miktari <= 70
      );
      setLowStockProducts(lowStock);

      // Son kullanma tarihi filtresi
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);

      const expiringSoon = products.filter(p => {
        if (!p.son_kullanma_tarihi) return false;
        const expDate = new Date(p.son_kullanma_tarihi);
        return expDate >= today && expDate <= oneWeekFromNow;
      });
      setExpiringSoonProducts(expiringSoon);

      setLoading(false);
    };
    getStockData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Stok verileri yükleniyor...</Text>
      </View>
    );
  }

  const renderProductRow = (product) => (
    <View key={product.id} style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 2 }]}>{product.urun_adi || product.id}</Text>
      <Text style={[styles.tableCell, { color: product.stok_miktari <= 20 ? '#F44336' : '#FFA726' }]}>
        {product.stok_miktari}
      </Text>
    </View>
  );

  const renderExpiringRow = (product) => {
    const expDate = new Date(product.son_kullanma_tarihi);
    const today = new Date();
    const diffTime = Math.abs(expDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (
      <View key={product.id} style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>{product.urun_adi || product.id}</Text>
        <Text style={[styles.tableCell, { color: diffDays <= 3 ? '#F44336' : '#FFA726'}]}>
          {diffDays} gün kaldı
        </Text>
      </View>
    );
  };
  

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stok Seviyesi Düşük Ürünler */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Stok Seviyesi Düşük Ürünler</Text>
        <Text style={styles.summaryValue}>{lowStockProducts.length} ürün</Text>
      </View>
      {lowStockProducts.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>Ürün Adı</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Stok</Text>
          </View>
          {lowStockProducts.map(renderProductRow)}
        </View>
      )}

      {/* SKT'si Yaklaşan Ürünler */}
      <View style={[styles.summaryCard, {marginTop: 20}]}>
        <Text style={styles.summaryTitle}>SKT'si Yaklaşan Ürünler</Text>
        <Text style={styles.summaryValue}>{expiringSoonProducts.length} ürün</Text>
      </View>
      {expiringSoonProducts.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>Ürün Adı</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Kalan Süre</Text>
          </View>
          {expiringSoonProducts.map(renderExpiringRow)}
        </View>
      )}

      {lowStockProducts.length === 0 && expiringSoonProducts.length === 0 && (
         <View style={styles.center}>
          <Text>Stoklar ve son kullanma tarihleri normal.</Text>
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
    marginBottom: 20,
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