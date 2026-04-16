import React, { useState, useEffect, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Modal,
} from "react-native";
import News from "./src/components/News";
import NewsDetail from "./src/components/NewsDetail";
import { fetchNewsService, NewsData } from "./src/utils/handle-api";
import {
    TextInput,
    FlatList,
    Platform,
    StatusBar as headerStatusBar,
    Pressable,
} from "react-native";
import { globalStyles } from "./src/styles/global";

const statusBarHeight =
    Platform.OS === "android" ? headerStatusBar.currentHeight : 0;

export default function App() {
    const [newsList, setNewsList] = useState<NewsData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);

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

    const filteredNewsList = useMemo(() => {
        return newsList
            .filter((news) =>
                news.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.published).getTime();
                const dateB = new Date(b.published).getTime();
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
    }, [newsList, searchQuery, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Últimas notícias</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar notícias..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={styles.headerActions}>
                    <Text style={styles.newsCount}>
                        {filteredNewsList.length} notícias encontradas
                    </Text>
                    <Pressable
                        style={[
                            styles.sortButton,
                            sortOrder === 'desc' && styles.sortButtonActive,
                        ]}
                        onPress={toggleSortOrder}
                    >
                        <Text style={styles.sortButtonText}>
                            {sortOrder === 'desc'
                                ? '↓ Mais recentes'
                                : '↑ Mais antigas'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>
                        Carregando notícias...
                    </Text>
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Erro: {error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredNewsList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <News
                            title={item.title}
                            image={item.image}
                            published={item.published}
                            link={item.link}
                            summary={item.summary}
                            newsData={item}
                            onPress={setSelectedNews}
                        />
                    )}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                height: 1,
                                backgroundColor: "#e0e0e0",
                                marginHorizontal: 16,
                            }}
                        />
                    )}
                    ListEmptyComponent={
                        !loading ? (
                            <View>
                                <Text>
                                    Nenhuma notícia disponível no momento.
                                </Text>
                            </View>
                        ) : null
                    }
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

            <Modal
                animationType="slide"
                visible={selectedNews !== null}
                onRequestClose={() => setSelectedNews(null)}
                presentationStyle="formSheet"
            >
                <SafeAreaView style={styles.modal}>
                    <NewsDetail
                        news={selectedNews}
                        onClose={() => setSelectedNews(null)}
                    />
                </SafeAreaView>
            </Modal>
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
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: globalStyles.primaryColor,
        alignItems: "center",
        paddingTop: statusBarHeight,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    newsCount: {
        marginTop: 4,
        fontSize: 14,
        color: "#666",
    },
    headerActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        width: "100%",
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    sortButtonActive: {
        backgroundColor: globalStyles.primaryColor,
        borderColor: globalStyles.primaryColor,
    },
    sortButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    searchInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
        marginTop: 8,
        width: "100%",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: globalStyles.bodyFontSize,
        color: "#666",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
    scrollContent: {
        padding: 16,
    },
    modal: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
