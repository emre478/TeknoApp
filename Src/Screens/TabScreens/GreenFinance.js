import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchProducts } from '../../Services/fetchProducts';
import { fetchSales } from '../../Services/fetchSales';

export default function GreenFinance() {
  const [dailyCo2, setDailyCo2] = useState(0);
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCarbonFootprintData = async () => {
      const [products, sales] = await Promise.all([
        fetchProducts(),
        fetchSales(),
      ]);

      const productsMap = new Map(products.map(p => [p.id, p]));
      const today = new Date().toISOString().slice(0, 10);
      let totalCo2 = 0;
      const todaySoldProducts = [];

      sales.forEach(sale => {
        if (sale.satis_tarihi?.slice(0, 10) === today && sale.urunler) {
          Object.values(sale.urunler).forEach(soldProduct => {
            const productDetails = productsMap.get(soldProduct.barkod);
            if (productDetails && productDetails.karbon_ayak_izi) {
              const adet = soldProduct.adet || 1;
              const co2 = (productDetails.karbon_ayak_izi || 0) * adet;
              totalCo2 += co2;
              todaySoldProducts.push({
                ...productDetails,
                adet,
                co2,
              });
            }
          });
        }
      });
      
      setDailyCo2(totalCo2);
      setSoldProducts(todaySoldProducts);
      setLoading(false);
    };

    getCarbonFootprintData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Yeşil Finans verileri hesaplanıyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>♻️ Bugünkü Toplam Karbon Ayak İzi</Text>
        <Text style={styles.summaryValue}>{dailyCo2.toFixed(2)} kg CO₂e</Text>
      </View>
      
      {soldProducts.length > 0 ? (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>Ürün Adı</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Adet</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>CO₂ (kg)</Text>
          </View>
          {soldProducts.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.urun_adi}</Text>
              <Text style={styles.tableCell}>{item.adet}</Text>
              <Text style={styles.tableCell}>{item.co2.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.center}>
          <Text>Bugün henüz karbon ayak izi olan bir ürün satılmadı.</Text>
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
    padding: 20,
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
});