import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {fetchProducts} from '../../Services/fetchProducts';
import {fetchSales} from '../../Services/fetchSales';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const [dailySummary, setDailySummary] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalCost: 0,
  });
  const [periodData, setPeriodData] = useState({
    daily: {revenue: 0, profit: 0, cost: 0},
    weekly: {revenue: 0, profit: 0, cost: 0},
    monthly: {revenue: 0, profit: 0, cost: 0},
  });
  const [chartData, setChartData] = useState({labels: [], data: []});
  const [categoryData, setCategoryData] = useState([]);
  const [etiketData, setEtiketData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const [productsResult, salesResult] = await Promise.all([
        fetchProducts(),
        fetchSales(),
      ]);

      // Pasta grafikler için ürünleri işle
      const kategoriMap = {};
      const etiketMap = {};
      productsResult.forEach(item => {
        if (item.kategori) {
          if (!kategoriMap[item.kategori]) kategoriMap[item.kategori] = 0;
          kategoriMap[item.kategori]++;
        }
        if (Array.isArray(item.mobil_etiket)) {
          item.mobil_etiket.forEach(et => {
            if (!etiketMap[et]) etiketMap[et] = 0;
            etiketMap[et]++;
          });
        }
      });

      // Özet ve tablolar için satışları işle
      const today = new Date().toISOString().slice(0, 10);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      let dailySales = 0,
        dailyRevenue = 0,
        dailyCost = 0,
        dailyProfit = 0;
      let weeklyRevenue = 0,
        weeklyCost = 0,
        weeklyProfit = 0;
      let monthlyRevenue = 0,
        monthlyCost = 0,
        monthlyProfit = 0;

      const dateMap = {};
      const productsMap = new Map(productsResult.map(p => [p.id, p]));

      salesResult.forEach(sale => {
        const satisTarihi = sale.satis_tarihi?.slice(0, 10);
        let currentSaleCost = 0;
        let currentSaleTotalItems = 0;

        if (sale.urunler) {
          Object.values(sale.urunler).forEach(soldProduct => {
            const barkod = soldProduct.barkod;
            const productDetails = productsMap.get(barkod);

            if (productDetails) {
              const adet = soldProduct.adet || 1;
              currentSaleCost += (productDetails.alis_fiyati || 0) * adet;
              currentSaleTotalItems += adet;
            }
          });
        }

        const currentSaleRevenue = sale.toplam_fiyat || 0;
        const currentSaleProfit = currentSaleRevenue - currentSaleCost;

        if (satisTarihi === today) {
          dailySales += currentSaleTotalItems;
          dailyRevenue += currentSaleRevenue;
          dailyCost += currentSaleCost;
          dailyProfit += currentSaleProfit;
        }

        if (satisTarihi >= oneWeekAgo) {
          weeklyRevenue += currentSaleRevenue;
          weeklyCost += currentSaleCost;
          weeklyProfit += currentSaleProfit;
        }

        if (satisTarihi >= oneMonthAgo) {
          monthlyRevenue += currentSaleRevenue;
          monthlyCost += currentSaleCost;
          monthlyProfit += currentSaleProfit;
        }

        if (satisTarihi && satisTarihi >= oneWeekAgo) {
          if (!dateMap[satisTarihi]) dateMap[satisTarihi] = 0;
          dateMap[satisTarihi] += currentSaleProfit;
        }
      });

      setDailySummary({
        totalSales: dailySales,
        totalRevenue: dailyRevenue,
        totalProfit: dailyProfit,
        totalCost: dailyCost,
      });

      setPeriodData({
        daily: {revenue: dailyRevenue, profit: dailyProfit, cost: dailyCost},
        weekly: {
          revenue: weeklyRevenue,
          profit: weeklyProfit,
          cost: weeklyCost,
        },
        monthly: {
          revenue: monthlyRevenue,
          profit: monthlyProfit,
          cost: monthlyCost,
        },
      });

      const labels = Object.keys(dateMap).sort().slice(-7);
      const data = labels.map(date => dateMap[date]);
      setChartData({labels, data});

      setCategoryData(
        Object.keys(kategoriMap).map(k => ({
          name: k,
          population: kategoriMap[k],
          color: getRandomColor(),
        })),
      );

      setEtiketData(
        Object.keys(etiketMap).map(e => ({
          name: e,
          population: etiketMap[e],
          color: getRandomColor(),
        })),
      );
    };

    getData();
  }, []);

  const getRandomColor = () => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const CustomLegend = ({data}) => (
    <View style={styles.legendContainer}>
      {data.map(item => (
        <View key={item.name} style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, {backgroundColor: item.color}]}
          />
          <Text
            style={
              styles.legendText
            }>{`${item.name} (${item.population})`}</Text>
        </View>
      ))}
    </View>
  );

  const SummarySection = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>📊 Günlük Satış Özeti</Text>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          🧾 Bugünkü Toplam Satış: {dailySummary.totalSales} ürün
        </Text>
        <Text style={styles.summaryText}>
          💰 Bugünkü Toplam Gelir: {dailySummary.totalRevenue.toFixed(2)} ₺
        </Text>
        <Text style={styles.summaryText}>
          💸 Bugünkü Toplam Maliyet: {dailySummary.totalCost.toFixed(2)} ₺
        </Text>
        <Text style={styles.summaryText}>
          📈 Bugünkü Toplam Kar: {dailySummary.totalProfit.toFixed(2)} ₺
        </Text>
      </View>
    </View>
  );

  const PeriodTable = () => (
    <View style={styles.tableContainer}>
      <Text style={styles.sectionTitle}>📋 Dönemsel Kar-Zarar Tablosu</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Dönem</Text>
          <Text style={styles.tableHeaderText}>Gelir (₺)</Text>
          <Text style={styles.tableHeaderText}>Maliyet (₺)</Text>
          <Text style={styles.tableHeaderText}>Kar (₺)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Günlük</Text>
          <Text style={styles.tableCell}>
            {periodData.daily.revenue.toFixed(2)}
          </Text>
          <Text style={styles.tableCell}>
            {periodData.daily.cost.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.tableCell,
              {color: periodData.daily.profit >= 0 ? '#4CAF50' : '#F44336'},
            ]}>
            {periodData.daily.profit.toFixed(2)}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Haftalık</Text>
          <Text style={styles.tableCell}>
            {periodData.weekly.revenue.toFixed(2)}
          </Text>
          <Text style={styles.tableCell}>
            {periodData.weekly.cost.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.tableCell,
              {color: periodData.weekly.profit >= 0 ? '#4CAF50' : '#F44336'},
            ]}>
            {periodData.weekly.profit.toFixed(2)}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Aylık</Text>
          <Text style={styles.tableCell}>
            {periodData.monthly.revenue.toFixed(2)}
          </Text>
          <Text style={styles.tableCell}>
            {periodData.monthly.cost.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.tableCell,
              {color: periodData.monthly.profit >= 0 ? '#4CAF50' : '#F44336'},
            ]}>
            {periodData.monthly.profit.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const ChartSection = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>📈 Son 7 Gün Kar Grafiği</Text>
      {chartData.labels.length > 0 && (
        <BarChart
          data={{labels: chartData.labels, datasets: [{data: chartData.data}]}}
          width={screenWidth - 32}
          height={220}
          fromZero
          yAxisLabel="₺"
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
            labelColor: () => '#333',
            decimalPlaces: 2,
            barPercentage: 0.7,
          }}
          style={{marginVertical: 8, borderRadius: 12}}
        />
      )}
    </View>
  );

  const CategoryChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>📂 Kategori Dağılımı</Text>
      {categoryData.length > 0 && (
        <>
          <PieChart
            data={categoryData}
            width={screenWidth - 32}
            height={180}
            chartConfig={{color: () => '#000'}}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />
          <CustomLegend data={categoryData} />
        </>
      )}
    </View>
  );

  const EtiketChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>🏷️ Mobil Etiket Dağılımı</Text>
      {etiketData.length > 0 && (
        <>
          <PieChart
            data={etiketData}
            width={screenWidth - 32}
            height={180}
            chartConfig={{color: () => '#000'}}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />
          <CustomLegend data={etiketData} />
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SummarySection />
      <PeriodTable />
      <ChartSection />
      <CategoryChart />
      <EtiketChart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e7d32',
    marginBottom: 4,
  },
  table: {
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
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#333',
  },
});

export default Dashboard;
