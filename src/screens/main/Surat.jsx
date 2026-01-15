import { StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import ScreenWrapper from '../../components/layout/Layout';
import AyatCard from '../../components/common/AyatCard';
import SuratCard from '../../components/common/SuratCard';
import CustomAlert from '../../components/common/CustomAlert';

import {
    initializeSurahsAsync,
    downloadSurahAsync,
    removeSurahAsync,
    selectAllSurahsWithStatus,
    clearError
} from '../../redux/features/quran/surahSlice';

import SURAH_DATA from '../../assets/data/index.json';
import { COLORS } from '../../constants/theme';

export default function Surat() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const allSurahs = useSelector(selectAllSurahsWithStatus);
    const { error } = useSelector(state => state.quran);

    // Filter State
    const [showOfflineOnly, setShowOfflineOnly] = useState(false);

    // Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        type: 'info',
        showCancel: false,
        confirmText: 'Continue',
        cancelText: 'Cancel'
    });

    useEffect(() => {
        // Initialize Surahs data on mount
        dispatch(initializeSurahsAsync(SURAH_DATA));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            setAlertConfig({
                title: 'Error',
                message: error,
                type: 'error',
                showCancel: false,
                confirmText: 'OK'
            });
            setAlertVisible(true);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleDownload = (id, name) => {
        dispatch(downloadSurahAsync(id));
    };

    const handleRemove = (id, name) => {
        setAlertConfig({
            title: 'Remove Surah?',
            message: `Are you sure you want to remove ${name} from offline storage?`,
            type: 'warning',
            showCancel: true,
            confirmText: 'Remove',
            cancelText: 'Keep',
            onConfirm: () => {
                dispatch(removeSurahAsync(id));
                setAlertVisible(false);
            },
            onCancel: () => setAlertVisible(false)
        });
        setAlertVisible(true);
    };

    // Filter Logic
    const filteredSurahs = showOfflineOnly
        ? allSurahs.filter(s => s.isBundled || s.isDownloaded)
        : allSurahs;

    const renderItem = ({ item }) => (
        <SuratCard
            number={item.id}
            englishName={item.name}
            arabicName={item.name}
            englishNameTranslation={item.translation}

            // Status Props
            isBundled={item.isBundled}
            isDownloaded={item.isDownloaded}
            isDownloading={item.isDownloading}
            canDownload={item.canDownload}
            canRemove={item.canRemove}

            // Actions
            onDownload={() => handleDownload(item.id, item.transliteration)}
            onRemove={() => handleRemove(item.id, item.transliteration)}
            onPress={() => navigation.navigate('SurahVerse', {
                id: item.id,
                name: item.name,
                transliteration: item.transliteration,
                translation: item.translation,
                type: item.type
            })}
        />
    );

    return (
        <ScreenWrapper>
            {/* Custom Alert */}
            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                showCancel={alertConfig.showCancel}
                confirmText={alertConfig.confirmText}
                cancelText={alertConfig.cancelText}
                onClose={() => {
                    if (alertConfig.onConfirm) alertConfig.onConfirm();
                    else setAlertVisible(false);
                }}
                onCancel={() => {
                    if (alertConfig.onCancel) alertConfig.onCancel();
                    else setAlertVisible(false);
                }}
            />

            <View style={styles.container}>
                <View style={styles.headerSpacing}>
                    <AyatCard />
                </View>

                {/* Filter Toggle */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, showOfflineOnly && styles.filterButtonActive]}
                        onPress={() => setShowOfflineOnly(!showOfflineOnly)}
                    >
                        <MaterialIcons
                            name={showOfflineOnly ? "offline-pin" : "list"}
                            size={20}
                            color={showOfflineOnly ? '#fff' : COLORS.primary}
                        />
                        <Text style={[styles.filterText, showOfflineOnly && styles.filterTextActive]}>
                            {showOfflineOnly ? "Showing Offline Only" : "Show All Surahs"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <SafeAreaView style={styles.listContainer} edges={['bottom']}>
                    <FlatList
                        data={filteredSurahs}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        paddingBottom={20}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No Surahs found.</Text>
                            </View>
                        }
                    />
                </SafeAreaView>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSpacing: {
        marginTop: '5%',
        marginHorizontal: 16,
        marginBottom: 10,
    },
    filterContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    filterTextActive: {
        color: '#fff',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 16,
    },
    listContent: {
        paddingBottom: 80,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    }
});