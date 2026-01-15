import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import SurahVerseCard from '../../components/common/SurahVerseCard';
import { surahService } from '../../services/surahService';
import { COLORS } from '../../constants/theme';
import ScreenWrapper from '../../components/layout/Layout';

export default function SurahDetail() {
    const route = useRoute();
    const { id, name, transliteration, translation, type } = route.params || {};

    const [surahData, setSurahData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSurah = async () => {
            try {
                setLoading(true);
                // Load data using the service (handles bundled, cached, or network)
                const data = await surahService.loadSurah(id);
                setSurahData(data);
                setError(null);
            } catch (err) {
                console.error("Failed to load surah:", err);
                setError("Failed to load Surah. Please check your internet connection.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSurah();
        }
    }, [id]);

    const renderVerse = ({ item }) => (
        <SurahVerseCard
            surahName={name}
            surahTransliteration={transliteration}
            surahTranslation={translation}
            surahType={type}
            verseNumber={item.id}
            arabicText={item.text}
            transliteration={item.transliteration}
            translation={item.translation}
        />
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading {transliteration}...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScreenWrapper>
            <View style={{ flex: 1, marginTop: '2%' }}>
                <FlatList
                    data={surahData?.verses || []}
                    renderItem={renderVerse}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: 20,
        paddingHorizontal: 0,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.primary,
        fontSize: 16,
    },
    errorText: {
        color: COLORS.error || 'red',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
});