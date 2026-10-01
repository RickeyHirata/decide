import { Tabs } from 'expo-router';
export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarLabelStyle:{fontSize:11},tabBarStyle:{minHeight:56}}}>
  <Tabs.Screen name="home" options={{title:'ホーム',tabBarIcon:()=>null}}/>
  <Tabs.Screen name="compose" options={{title:'＋',tabBarIcon:()=>null}}/>
  <Tabs.Screen name="notifications" options={{title:'通知',tabBarIcon:()=>null,tabBarBadge:2}}/>
  <Tabs.Screen name="profile" options={{title:'プロフィール',tabBarIcon:()=>null}}/>
</Tabs>}
