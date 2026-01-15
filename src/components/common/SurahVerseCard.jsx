// SurahVerseCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SurahVerseCard = ({
  surahName = 'الناس',           // Arabic Surah name
  surahTransliteration = 'An-Nas',
  surahTranslation = 'Mankind',
  surahType = 'meccan',
  verseNumber = 1,
  arabicText = 'قُلۡ أَعُذُ بِرَبِّ ٱلنَّاسِ',
  transliteration = 'Qul aAAoothu birabbi alnnasi',
  translation = 'Say, "I seek refuge in the Lord of mankind"',
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header: Surah Info + Verse Number */}
      <View style={styles.header}>
        <View style={styles.surahInfo}>
          <Text style={styles.surahName}>{surahName}</Text>
          <Text style={styles.surahMeta}>
            {surahTransliteration} • {surahTranslation} •{' '}
            <Text style={styles.surahType}>
              {surahType === 'meccan' ? 'مكّي' : 'مدني'}
            </Text>
          </Text>
        </View>
        <View style={styles.verseBadge}>
          <Text style={styles.verseText}>آية {verseNumber}</Text>
        </View>
      </View>

      {/* Arabic Verse */}
      <Text style={styles.arabicText}>{arabicText}</Text>

      {/* Transliteration */}
      <Text style={styles.transliterationText}>{transliteration}</Text>

      {/* Translation */}
      <Text style={styles.translationText}>{translation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  surahInfo: {
    flex: 1,
    marginRight: 12,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'right',
    marginBottom: 4,
  },
  surahMeta: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
  },
  surahType: {
    fontWeight: '600',
    color: '#1A5246',
  },
  verseBadge: {
    backgroundColor: '#1A5246',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  verseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  arabicText: {
    fontSize: 22,
    fontFamily: 'Arial', // Use a proper Arabic font if available (e.g., 'Amiri')
    textAlign: 'right',
    color: '#000',
    lineHeight: 30,
    marginBottom: 10,
  },
  transliterationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default SurahVerseCard;  