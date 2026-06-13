import { Tabs } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ACCENT_COLOR = '#a78bfa';
const INACTIVE_COLOR = '#6b7280';
const TAB_BG = '#0f172a';

const TAB_ITEMS = [
  { name: 'create', icon: 'add-circle-outline', activeIcon: 'add-circle', label: 'Create' },
  { name: 'search', icon: 'search-outline', activeIcon: 'search', label: 'Search' },
  { name: 'index', icon: 'grid-outline', activeIcon: 'grid', label: 'Dashboard' },
  { name: 'notifications', icon: 'notifications-outline', activeIcon: 'notifications', label: 'Alerts' },
  { name: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
];

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const tabItem = TAB_ITEMS.find(item => item.name === route.name);
          if (!tabItem) return null;

          const { options } = descriptors[route.key];
          const isActive = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole='button'
              accessibilityState={isActive ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Ionicons
                  name={isActive ? tabItem.activeIcon as any : tabItem.icon as any}
                  size={24}
                  color={isActive ? ACCENT_COLOR : INACTIVE_COLOR}
                />
                {isActive && <View style={styles.activeDot} />}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tabItem.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MaintenanceTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: any) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name='create' options={{ title: 'Create' }} />
      <Tabs.Screen name='search' options={{ title: 'Search' }} />
      <Tabs.Screen name='index' options={{ title: 'Dashboard' }} />
      <Tabs.Screen name='notifications' options={{ title: 'Alerts' }} />
      <Tabs.Screen name='profile' options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: TAB_BG,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
  },
  activeDot: {
    position: 'absolute',
    top: 4,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_COLOR,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: INACTIVE_COLOR,
    marginTop: 4,
  },
  tabLabelActive: {
    color: ACCENT_COLOR,
    fontWeight: '700',
  },
});