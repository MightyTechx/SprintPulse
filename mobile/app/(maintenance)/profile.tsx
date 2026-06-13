import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Switch, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme';
import { useAppType } from '../../src/context/AppTypeContext';
import { GradientCard } from '../../src/components/GradientCard';
import { authService } from '../../src/services/auth';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  iconColor?: string;
}

function MenuItem({ icon, title, subtitle, onPress, showArrow = true, rightElement, iconColor = colors.card.success }: MenuItemProps) {
  const content = (
    <View style={styles.menuItem}>
      <View style={[styles.menuIconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text variant="bodyLarge" style={styles.menuTitle}>{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.menuSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightElement || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
      ))}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface AppTypeOptionProps {
  type: 'PTW' | 'Maintenance';
  isSelected: boolean;
  onPress: () => void;
  accentColor: string;
  secondColor?: string;
}

function AppTypeOption({ type, isSelected, onPress, accentColor }: AppTypeOptionProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.appTypeOption,
          isSelected && { backgroundColor: `${accentColor}12` },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[
          styles.appTypeIconOuter,
          { borderColor: isSelected ? accentColor : 'transparent' }
        ]}>
          <View style={[
            styles.appTypeIconContainer,
            {
              backgroundColor: isSelected ? accentColor : `${accentColor}15`,
              shadowColor: isSelected ? accentColor : 'transparent',
            }
          ]}>
            {type === 'PTW' ? (
              <Ionicons
                name="document-text"
                size={26}
                color={isSelected ? '#fff' : accentColor}
              />
            ) : (
              <Ionicons
                name="construct"
                size={26}
                color={isSelected ? '#fff' : accentColor}
              />
            )}
          </View>
        </View>

        <View style={styles.appTypeTextContainer}>
          <Text style={[
            styles.appTypeText,
            isSelected && { color: accentColor }
          ]}>
            {type === 'PTW' ? 'PTW' : 'Maintenance'}
          </Text>
          <Text style={[
            styles.appTypeSubtext,
            isSelected && { color: `${accentColor}99` }
          ]}>
            {type === 'PTW' ? 'Permit to Work' : 'Asset Management'}
          </Text>
        </View>

        {isSelected && (
          <View style={[styles.appTypeCheckmark, { backgroundColor: accentColor }]}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const router = useRouter();
  const { appType, setAppType } = useAppType();

  const isPTW = appType === 'PTW';
  const accentColor = isPTW ? '#a78bfa' : '#10b981';
  const secondColor = isPTW ? '#7c3aed' : '#059669';

  const handleAppTypeChange = (type: 'PTW' | 'Maintenance') => {
    setAppType(type);
    if (type === 'PTW') {
      router.replace('/(ptw)' as any);
    } else {
      router.replace('/(maintenance)' as any);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={isPTW ? ['#1e1b4b', '#312e81', '#4338ca'] : ['#064e3b', '#065f46', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative elements */}
        <View style={[styles.headerDecoration, styles.headerDecorationLeft]} />
        <View style={[styles.headerDecoration, styles.headerDecorationRight]} />

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[accentColor, secondColor]}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </LinearGradient>
            <View style={[styles.editBadge, { backgroundColor: accentColor }]}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
            {/* Glow effect */}
            <View style={[styles.avatarGlow, { backgroundColor: accentColor }]} />
          </View>
          <Text variant="headlineSmall" style={styles.userName}>
            Admin User
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            admin@infygen.com
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}50` }]}>
            <View style={[styles.roleDot, { backgroundColor: accentColor }]} />
            <Text variant="labelSmall" style={[styles.roleText, { color: accentColor }]}>
              Administrator
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Application Type Selector */}
        <View style={styles.appTypeContainer}>
          <View style={styles.appTypeLabelRow}>
            <View style={[styles.appTypeLabelIcon, { backgroundColor: `${accentColor}20` }]}>
              <Ionicons name="apps" size={14} color={accentColor} />
            </View>
            <Text variant="labelMedium" style={[styles.appTypeLabel, { color: accentColor }]}>
              Application Type
            </Text>
          </View>

          <View style={[styles.appTypeCard, { borderColor: `${accentColor}25` }]}>
            <AppTypeOption
              type="PTW"
              isSelected={isPTW}
              onPress={() => handleAppTypeChange('PTW')}
              accentColor="#a78bfa"
              secondColor="#8b5cf6"
            />

            <View style={[styles.appTypeDivider, { backgroundColor: `${accentColor}15` }]} />

            <AppTypeOption
              type="Maintenance"
              isSelected={!isPTW}
              onPress={() => handleAppTypeChange('Maintenance')}
              accentColor="#10b981"
              secondColor="#059669"
            />
          </View>
        </View>

        <Text variant="labelLarge" style={styles.sectionTitle}>Settings</Text>

        <GradientCard style={styles.settingsCard}>
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            iconColor={accentColor}
          />
          <Divider style={[styles.divider, { backgroundColor: `${accentColor}15` }]} />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notification preferences"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={accentColor}
              />
            }
            showArrow={false}
            iconColor={accentColor}
          />
          <Divider style={[styles.divider, { backgroundColor: `${accentColor}15` }]} />
          <MenuItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Currently enabled"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={accentColor}
              />
            }
            showArrow={false}
            iconColor={accentColor}
          />
        </GradientCard>

        <Text variant="labelLarge" style={styles.sectionTitle}>Support</Text>

        <GradientCard style={styles.settingsCard}>
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with using the app"
            iconColor={accentColor}
          />
          <Divider style={[styles.divider, { backgroundColor: `${accentColor}15` }]} />
          <MenuItem
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="View legal documents"
            iconColor={accentColor}
          />
          <Divider style={[styles.divider, { backgroundColor: `${accentColor}15` }]} />
          <MenuItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version 1.0.0"
            iconColor={accentColor}
          />
        </GradientCard>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: `${colors.card.danger}25` }]}
          onPress={() => {
            authService.logout();
            router.replace('/auth/login' as any);
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.logoutIconWrapper, { backgroundColor: `${colors.card.danger}15` }]}>
            <Ionicons name="log-out-outline" size={20} color={colors.card.danger} />
          </View>
          <Text variant="titleMedium" style={styles.logoutText}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
  },
  headerDecorationLeft: {
    top: -80,
    left: -60,
    backgroundColor: '#10b981',
  },
  headerDecorationRight: {
    bottom: -40,
    right: -40,
    backgroundColor: '#a78bfa',
  },
  profileHeader: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    marginBottom: 18,
    position: 'relative',
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -10,
    left: -10,
    opacity: 0.3,
    zIndex: -1,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userEmail: {
    color: colors.text.secondary,
    marginBottom: 14,
    fontSize: 14,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  roleText: {
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appTypeContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  appTypeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  appTypeLabelIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTypeLabel: {
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  appTypeCard: {
    backgroundColor: colors.background.surface,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  appTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    position: 'relative',
  },
  appTypeIconOuter: {
    padding: 3,
    borderRadius: 16,
    borderWidth: 2,
    marginRight: 4,
  },
  appTypeIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  appTypeTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  appTypeText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  appTypeSubtext: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  appTypeCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  appTypeDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: colors.text.secondary,
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  menuSubtitle: {
    color: colors.text.secondary,
    marginTop: 2,
    fontSize: 13,
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: `${colors.card.danger}10`,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    gap: 12,
  },
  logoutIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.card.danger,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
