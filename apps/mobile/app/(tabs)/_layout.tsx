import { router, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useDemoState } from '../../src/demo-context';

export default function TabsLayout() {
  const { state } = useDemoState();
  return <Tabs screenOptions={{ headerShown: false, tabBarLabelStyle: { fontSize: 11 }, tabBarStyle: { minHeight: 56 } }}>
    <Tabs.Screen name="home" options={{ title: 'ホーム', tabBarIcon: () => null }} />
    <Tabs.Screen name="compose" options={{
      title: '＋',
      tabBarButton: () => <Pressable accessibilityRole="button" accessibilityLabel="相談を作成" onPress={() => router.push('/compose')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 24 }}>＋</Text><Text style={{ fontSize: 11 }}>作成</Text></Pressable>,
    }} />
    <Tabs.Screen name="notifications" options={{ title: '通知', tabBarIcon: () => null, tabBarBadge: state.unresolvedActions || undefined }} />
    <Tabs.Screen name="profile" options={{ title: 'プロフィール', tabBarIcon: () => null }} />
  </Tabs>;
}
