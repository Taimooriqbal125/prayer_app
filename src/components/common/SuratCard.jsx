import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import { COLORS } from '../../constants/theme';

const SuratCard = ({
  number,
  englishName,
  arabicName,
  englishNameTranslation,
  isBundled,
  isDownloaded,
  isDownloading,
  canDownload,
  canRemove,
  onDownload,
  onRemove,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Number Badge */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{number}</Text>
      </View>

      {/* Names Container */}
      <View style={styles.infoContainer}>
        <Text style={styles.englishName}>{englishName}</Text>
        <Text style={styles.translationName}>{englishNameTranslation}</Text>
      </View>

      {/* Actions & Arabic Name */}
      <View style={styles.rightContainer}>
        <Text style={styles.arabicName}>{arabicName}</Text>

        <View style={styles.actionsContainer}>
          {isDownloading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              {canDownload && (
                <TouchableOpacity onPress={onDownload} style={styles.iconButton}>
                  <MaterialIcons name="cloud-download" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              )}

              {canRemove && (
                <TouchableOpacity onPress={onRemove} style={styles.iconButton}>
                  <MaterialIcons name="delete-outline" size={24} color={COLORS.error || '#FF5252'} />
                </TouchableOpacity>
              )}

              {isBundled && (
                <MaterialIcons name="check-circle-outline" size={20} color={COLORS.primary} style={{ opacity: 0.5 }} />
              )}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
numberBadge: {
  backgroundColor: '#1A5246',
  borderRadius: 18, // Top-left and bottom-right
  borderTopLeftRadius: 10,
  borderTopRightRadius: 18,
  borderBottomLeftRadius: 18,
  borderBottomRightRadius: 10,
  width: 36,
  height: 36,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  // Optional: Add slight rotation for dynamic look
  transform: [{ rotate: '-2deg' }],
},
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  englishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  translationName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  arabicName: {
    fontSize: 18, // Slightly larger for Arabic
    color: '#1A5246',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 24, // Reserve space to prevent jumping
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  }
});

export default SuratCard;