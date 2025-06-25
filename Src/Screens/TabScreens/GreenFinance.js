import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { fetchProducts } from '../../Services/fetchProducts';
import { fetchSales } from '../../Services/fetchSales';


const screenWidth = Dimensions.get('window').width;

export default function GreenFinance() {
  const [dailyCo2, setDailyCo2] = useState(0);
  const [soldProducts, setSoldProducts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCarbonFootprintData = async () => {
      const [products, sales] = await Promise.all([
        fetchProducts(),
        fetchSales(),
      ]);

      const productsMap = new Map(products.map(p => [p.id, p]));
      const today = new Date().toISOString().slice(0, 10);
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      let totalCo2Today = 0;
      const todaySoldProducts = [];
      const monthlyCo2Map = {};

      sales.forEach(sale => {
        const saleDate = sale.satis_tarihi?.slice(0, 10);
        if (!saleDate || !sale.urunler) return;

        let saleCo2 = 0;
        Object.values(sale.urunler).forEach(soldProduct => {
          const productDetails = productsMap.get(soldProduct.barkod);
          if (productDetails && productDetails.karbon_ayak_izi) {
            const adet = soldProduct.adet || 1;
            const co2 = (productDetails.karbon_ayak_izi || 0) * adet;
            saleCo2 += co2;
            
            if (saleDate === today) {
              todaySoldProducts.push({ ...productDetails, adet, co2 });
            }
          }
        });

        if (saleDate === today) {
          totalCo2Today += saleCo2;
        }

        if (saleDate >= oneMonthAgo) {
          monthlyCo2Map[saleDate] = (monthlyCo2Map[saleDate] || 0) + saleCo2;
        }
      });
      
      setDailyCo2(totalCo2Today);
      setSoldProducts(todaySoldProducts);

      if (Object.keys(monthlyCo2Map).length > 0) {
        const sortedDates = Object.keys(monthlyCo2Map).sort();
        const labels = sortedDates.map(date => date.slice(5).replace('-', '/'));
        const data = sortedDates.map(date => monthlyCo2Map[date]);
        setChartData({
          labels,
          datasets: [{ data }],
        });
      }

      setLoading(false);
    };

    getCarbonFootprintData();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: () => '#333',
    decimalPlaces: 1,
    barPercentage: 0.5,
  };

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

      {chartData && chartData.datasets && Array.isArray(chartData.datasets) && chartData.datasets[0] && Array.isArray(chartData.datasets[0].data) && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>📊 Son 30 Günlük CO₂ Dağılımı</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={chartData}
              width={Math.max(screenWidth - 32, chartData.labels.length * 50)}
              height={250}
              chartConfig={chartConfig}
              yAxisSuffix=" kg"
              fromZero
              verticalLabelRotation={30}
            />
          </ScrollView>
        </View>
      )}

      {soldProducts.length === 0 && !chartData && (
        <View style={styles.center}>
          <Text>Karbon ayak izi verisi bulunamadı.</Text>
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
    marginBottom: 8,
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
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});