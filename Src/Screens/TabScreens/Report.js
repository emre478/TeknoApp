import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {fetchProducts} from '../../Services/fetchProducts';
import {fetchSales} from '../../Services/fetchSales';

const screenWidth = Dimensions.get('window').width;

const Report = () => {
  const [loading, setLoading] = useState(true);
  const [totalSoldCount, setTotalSoldCount] = useState(0);
  const [topSoldProducts, setTopSoldProducts] = useState(null);
  const [topProfitableProducts, setTopProfitableProducts] = useState(null);

  useEffect(() => {
    const generateReport = async () => {
      const [products, sales] = await Promise.all([
        fetchProducts(),
        fetchSales(),
      ]);

      if (!products.length || !sales.length) {
        setLoading(false);
        return;
      }

      const productsMap = new Map(products.map(p => [p.id, p]));
      const productStats = {};

      let totalItemsSold = 0;

      sales.forEach(sale => {
        if (sale.urunler) {
          Object.values(sale.urunler).forEach(soldProduct => {
            const {barkod, adet = 1} = soldProduct;
            totalItemsSold += adet;

            const productDetails = productsMap.get(barkod);
            if (productDetails) {
              if (!productStats[barkod]) {
                productStats[barkod] = {
                  name: productDetails.urun_adi,
                  totalSold: 0,
                  totalProfit: 0,
                };
              }

              productStats[barkod].totalSold += adet;
              const profitPerItem =
                (productDetails.satis_fiyati || 0) -
                (productDetails.alis_fiyati || 0);
              productStats[barkod].totalProfit += profitPerItem * adet;
            }
          });
        }
      });

      setTotalSoldCount(totalItemsSold);

      const statsArray = Object.values(productStats);

      // En çok satılan 10 ürün
      const sortedBySold = [...statsArray]
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10);
      setTopSoldProducts({
        labels: sortedBySold.map(p => p.name),
        datasets: [{data: sortedBySold.map(p => p.totalSold)}],
      });

      // En karlı 10 ürün
      const sortedByProfit = [...statsArray]
        .sort((a, b) => b.totalProfit - a.totalProfit)
        .slice(0, 10);
      setTopProfitableProducts({
        labels: sortedByProfit.map(p => p.name),
        datasets: [{data: sortedByProfit.map(p => p.totalProfit)}],
      });

      setLoading(false);
    };

    generateReport();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
    labelColor: () => '#333',
    decimalPlaces: 2,
    barPercentage: 0.6,
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Raporlar oluşturuluyor...</Text>
      </View>
    );
  }

  if (!totalSoldCount) {
    return (
      <View style={styles.center}>
        <Text>Rapor oluşturmak için yeterli satış verisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Toplam Satılan Ürün</Text>
        <Text style={styles.summaryValue}>{totalSoldCount} adet</Text>
      </View>

      {topSoldProducts && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>🏆 En Çok Satılan 10 Ürün</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={topSoldProducts}
              width={Math.max(screenWidth - 32, topSoldProducts.labels.length * 60)}
              height={250}
              yAxisLabel=""
              yAxisSuffix=" adet"
              chartConfig={{
                ...chartConfig,
                propsForVerticalLabels: { fontSize: 10 },
              }}
              verticalLabelRotation={0}
              fromZero
            />
          </ScrollView>
        </View>
      )}

      {topProfitableProducts && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>💰 En Karlı 10 Ürün</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={topProfitableProducts}
              width={Math.max(screenWidth - 32, topProfitableProducts.labels.length * 60)}
              height={250}
              yAxisLabel="₺"
              yAxisSuffix=""
              chartConfig={{
                ...chartConfig,
                propsForVerticalLabels: { fontSize: 10 },
              }}
              verticalLabelRotation={0}
              fromZero
            />
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

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
  chartContainer: {
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

export default Report;
