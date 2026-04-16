import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import News from './src/components/News';
import { fetchNewsService, NewsData } from './src/utils/handle-api';
import { FlatList, Platform, StatusBar as headerStatusBar } from 'react-native';
import { globalStyles } from './src/styles/global';

const statusBarHeight = Platform.OS === 'android' ? headerStatusBar.currentHeight : 0;

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsService();
      setNewsList(data);
    } catch (err: any) {
      setError(err.message || "Erro ao obter notícias");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Últimas notícias</Text>
        <Text style={styles.newsCount}>{newsList.length} notícias encontradas</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando notícias...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      ) : (
        <FlatList 
          data={newsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <News
              title={item.title}
              image={item.image}
              published={item.published}
              link={item.link}
              summary={item.summary}
            /> )}

          ItemSeparatorComponent={() => 
            <View style={{ 
                    height: 1, 
                    backgroundColor:'#e0e0e0', 
                    marginHorizontal: 16 
                  }} 
          />}

          ListEmptyComponent={!loading ? (
            <View>
              <Text>Nenhuma notícia disponível no momento.</Text>
            </View>
          ) : null}
        />
        // <ScrollView contentContainerStyle={styles.scrollContent}>
        //   {newsList.map((item) => (
        //     <News
        //       key={item.id.toString()}
        //       title={item.title}
        //       image={item.image}
        //       published={item.published}
        //       link={item.link}
        //       summary={item.summary}
        //     />
        //   ))}
        // </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.primaryColor,
    alignItems: 'center',
    paddingTop: statusBarHeight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  newsCount: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: globalStyles.bodyFontSize,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
});
