import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { DemoBanner, Screen, usePalette } from '../src/ui';

export default function Welcome() {
  const c = usePalette();
  return <Screen>
    <DemoBanner />
    <Text style={{ fontSize: 34, fontWeight: '800', color: c.ink }}>迷いを、いい決断に。</Text>
    <Text style={{ color: c.muted, lineHeight: 24, marginVertical: 18 }}>二択を友達に相談し、決めた後まで振り返れます。</Text>
    <View accessibilityLabel="Apple認証は未接続" style={{ minHeight: 52, borderRadius: 14, backgroundColor: c.surface, justifyContent: 'center', padding: 14 }}><Text style={{ color: c.muted, textAlign: 'center' }}>Appleで続ける — ローカルでは未接続</Text></View>
    <View accessibilityLabel="Google認証は未接続" style={{ minHeight: 52, borderRadius: 14, backgroundColor: c.surface, justifyContent: 'center', padding: 14, marginTop: 10 }}><Text style={{ color: c.muted, textAlign: 'center' }}>Googleで続ける — ローカルでは未接続</Text></View>
    <Link href="/(tabs)/home" style={{ color: c.ink, minHeight: 48, paddingTop: 18 }}>公開相談のローカル見本を見る</Link>
  </Screen>;
}
