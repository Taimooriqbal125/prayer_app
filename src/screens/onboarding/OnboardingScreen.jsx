import React, { useRef, useState } from 'react';
import {
    FlatList,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../../redux/features/app/appSlice';
import ScreenWrapper from '../../components/layout/Layout';

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: '#2E8B57', // Sea Green
    secondary: '#DAA520', // GoldenRod
    white: '#FFFFFF',
    text: '#333333',
    textLight: '#666666',
    background: '#F8F9FA',
};

const onboardingData = [
    {
        id: '1',
        title: 'Track Your Prayers',
        description: 'Keep track of your daily Salah and ensure you never miss a prayer with our easy logging system.',
        emoji: '🕌',
    },
    {
        id: '2',
        title: 'Qibla Direction',
        description: 'Find the accurate Qibla direction from anywhere in the world to perform your prayers correctly.',
        emoji: '🧭',
    },
    {
        id: '3',
        title: 'Daily Adhkar & Duas',
        description: 'Enlighten your heart with daily Adhkar and authentic Duas from the Sunnah.',
        emoji: '📿',
    },
];

const OnboardingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.slide, { width }]}>
                <View style={styles.imageContainer}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            finishOnboarding();
        }
    };

    const handleSkip = () => {
        finishOnboarding();
    };

    const finishOnboarding = () => {
        dispatch(completeOnboarding());
    };

    const handleScroll = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    return (
        <ScreenWrapper style={{ padding: 0 }} statusBarColor={COLORS.background}>
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                bounces={false}
                testID="onboarding-flatlist"
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />

            <View style={styles.footer}>
                <View style={styles.paginationContainer}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            testID={`pagination-dot-${index}`}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === currentIndex ? COLORS.primary : '#D3D3D3',
                                    width: index === currentIndex ? 20 : 10,
                                },
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonsContainer}>
                    {currentIndex !== onboardingData.length - 1 ? (
                        <>
                            <TouchableOpacity
                                onPress={handleSkip}
                                style={styles.skipButton}
                                testID="skip-button"
                            >
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleNext}
                                style={styles.nextButton}
                                testID="next-button"
                            >
                                <Text style={styles.nextText}>Next</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={handleNext}
                            style={styles.getStartedButton}
                            testID="get-started-button"
                        >
                            <Text style={styles.getStartedText}>Get Started</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    emoji: {
        fontSize: 100,
    },
    textContainer: {
        flex: 0.3,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: COLORS.textLight,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    footer: {
        flex: 0.2, // Occupy bottom 20%
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    skipButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    skipText: {
        fontSize: 16,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    nextText: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    getStartedButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    getStartedText: {
        fontSize: 18,
        color: COLORS.white,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;