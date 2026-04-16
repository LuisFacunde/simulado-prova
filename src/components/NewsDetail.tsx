import React from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { NewsData } from "../utils/handle-api";
import { globalStyles } from "../styles/global";

interface NewsDetailProps {
    news: NewsData | null;
    onClose: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news, onClose }) => {
    if (!news) {
        return null;
    }

    const handleOpenLink = () => {
        Linking.openURL(news.link).catch(() => {
            console.error("Erro ao abrir link:", news.link);
        });
    };

    const screenWidth = Dimensions.get("window").width;

    return (
        <View style={styles.containerWrapper}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>✕ Fechar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
                {news.image ? (
                    <Image
                        source={{ uri: news.image }}
                        style={[styles.image, { width: screenWidth }]}
                        resizeMode="cover"
                        onError={() => console.log("Erro ao carregar imagem")}
                    />
                ) : (
                    <View style={[styles.imageFallback, { width: screenWidth }]} />
                )}

                <View style={styles.content}>
                    <Text style={styles.title}>{news.title}</Text>

                    <Text style={styles.date}>
                        {new Date(news.published).toLocaleDateString("pt-BR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>

                    <Text style={styles.summary}>{news.summary}</Text>

                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={handleOpenLink}
                    >
                        <Text style={styles.buttonPrimaryText}>
                            Ler notícia completa
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        alignItems: "flex-end",
    },
    closeButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    closeButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    image: {
        height: 220,
        backgroundColor: "#e0e0e0",
    },
    imageFallback: {
        height: 220,
        backgroundColor: "#d0d0d0",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 16,
        paddingBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#000",
        lineHeight: 28,
    },
    date: {
        fontSize: 12,
        color: "#999",
        marginBottom: 16,
    },
    summary: {
        fontSize: 14,
        lineHeight: 22,
        color: "#333",
        marginBottom: 20,
    },
    buttonPrimary: {
        backgroundColor: globalStyles.primaryColor,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    buttonPrimaryText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default NewsDetail;
