import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../components/layout/Layout';
import CircularProgress from '../../components/common/CircularProgress';
import {
  increment,
  reset,
  nextPhrase,
  prevPhrase,
  setLimit,
} from '../../redux/features/tasbih/tasbihSlice';

const { width } = Dimensions.get('window');

const LIMIT_OPTIONS = [33, 100, 150, 200];

export default function Tisbih() {
  const dispatch = useDispatch();
  const { count, limit, currentPhraseIndex, phrases, totalCount } = useSelector(
    (state) => state.tasbih
  );
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);

  const currentPhrase = phrases[currentPhraseIndex];

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleReset = () => {
    dispatch(reset());
  };

  const handleNext = () => {
    dispatch(nextPhrase());
  };

  const handlePrev = () => {
    dispatch(prevPhrase());
  };

  const handleLimitChange = (newLimit) => {
    dispatch(setLimit(newLimit));
    setLimitModalVisible(false);
  };

  return (
    <ScreenWrapper scroll={true} showBackground={true}>
      <View style={styles.container}>
        {/* Tasbih Card */}
        <View style={styles.cardContainer}>
          <ImageBackground
            source={{ uri: 'https://www.transparenttextures.com/patterns/islamic-art.png' }}
            style={styles.card}
            imageStyle={{ tintColor: '#0A332B', opacity: 0.3 }}
          >
            {/* Progress Display */}
            <View style={styles.progressSection}>
              <CircularProgress
                progress={count}
                maxProgress={limit}
                size={220}
                strokeWidth={12}
                color="#EAB308" // Gold/Yellow
                backgroundColor="rgba(255,255,255,0.1)"
              >
                <View style={styles.counterTextContainer}>
                  <Text style={styles.countText}>{count}</Text>
                  <Text style={styles.limitText}>{count}/{limit}</Text>
                </View>
              </CircularProgress>
            </View>

            {/* Phrase Switcher */}
            <View style={styles.phraseContainer}>
              <TouchableOpacity onPress={handlePrev} style={styles.arrowButton} testID="prev-phrase-btn">
                <Text style={styles.arrowText}>{'<'}</Text>
              </TouchableOpacity>

              <View style={styles.phraseTextContainer}>
                <Text style={styles.phraseText}>{currentPhrase.text}</Text>
                <Text style={styles.translationText}>{currentPhrase.translation}</Text>
              </View>

              <TouchableOpacity onPress={handleNext} style={styles.arrowButton} testID="next-phrase-btn">
                <Text style={styles.arrowText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Controls Section */}
        <View style={styles.controlsRow}>
          {/* Counter Selection Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setLimitModalVisible(true)}
            testID="limit-select-btn"
          >
            <View style={styles.controlButtonContent}>
              <Text style={styles.controlButtonText}>{limit}</Text>
              <Text style={styles.controlButtonSubText}>⌵</Text>
            </View>
          </TouchableOpacity>

          {/* Main Big Tap Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleIncrement}
            style={styles.mainTapButton}
            testID="increment-btn"
          >
            <View style={styles.mainTapButtonInner}>
              <View style={[styles.mainTapButtonRipple, { opacity: 0.2 }]} />
              <View style={[styles.mainTapButtonRipple, { opacity: 0.4, width: 60, height: 60 }]} />
              <View style={styles.mainTapButtonCenter} />
            </View>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity onPress={handleReset} style={styles.controlButton} testID="reset-btn">
            <View style={styles.controlButtonContent}>
              <Text style={styles.controlButtonText}>Reset</Text>
              <Text style={styles.controlButtonSubText}>↺</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Limit Selection Modal */}
        <Modal
          visible={isLimitModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setLimitModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setLimitModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Target</Text>
                {LIMIT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      limit === option && styles.selectedOption
                    ]}
                    onPress={() => handleLimitChange(option)}
                    testID={`limit-option-${option}`}
                  >
                    <Text style={[
                      styles.optionText,
                      limit === option && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Session Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>Session Total:</Text>
          <Text style={styles.statsValue}>{totalCount}</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    height: 350,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#1A5246', // Dark Islamic Green
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  limitText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: -5,
  },
  phraseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  phraseTextContainer: {
    alignItems: 'center',
  },
  phraseText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  translationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 10,
  },
  controlButton: {
    width: 100,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  controlButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 4,
  },
  controlButtonSubText: {
    fontSize: 16,
    color: '#666',
  },
  mainTapButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTapButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(26, 82, 70, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTapButtonRipple: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: '#1A5246',
  },
  mainTapButtonCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A5246',
    elevation: 5,
  },
  statsContainer: {
    alignItems: 'center',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A5246',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A5246',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 4,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#F0F9F7',
    borderWidth: 1,
    borderColor: '#1A5246',
  },
  optionText: {
    fontSize: 18,
    color: '#666',
  },
  selectedOptionText: {
    color: '#1A5246',
    fontWeight: 'bold',
  },
});
