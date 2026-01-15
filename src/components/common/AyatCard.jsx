// AyatCard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

const AyatCard = () => {
  return (
    <View style={styles.container}>
      {/* Left: Arabic & English Text */}
      <View style={styles.textContainer}>
        <Text style={styles.arabicText}>
          ﴿اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي كُلَّهَا، دِقَّهُ وَجِلَّهُ، أَوَّلَهُ وَآخِرَهُ، عَلَانِيَتَهُ وَسِرَّهُ﴾
        </Text>
        <Text style={styles.englishText}>
          "O Allah, forgive me all my sins — the small and the great, the first and the last, the open and the hidden."
        </Text>
      </View>

      {/* Right: Mosque SVG/Image */}
      <Image
        source={require('../../assets/mosque.png')} 
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A5246',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  arabicText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Arial', // or use a proper Arabic font if needed
    textAlign: 'right',
    marginBottom: 4,
    lineHeight: 16,
  },
  englishText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 20,
  },
  image: {
    width: 90,
    height: 90,
  },
});

export default AyatCard;