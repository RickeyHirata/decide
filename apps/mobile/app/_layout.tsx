import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DemoProvider } from '../src/demo-context';

export default function RootLayout() {
  return <DemoProvider><StatusBar style="auto" /><Stack screenOptions={{ headerShadowVisible: false }} /></DemoProvider>;
}
