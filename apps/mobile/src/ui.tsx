import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { colors as designColors, radius, size, space, typography } from '@decide/design';

export function usePalette() {
  const source = useColorScheme() === 'dark' ? designColors.dark : designColors.light;
  return {
    ...source,
    lime: source.aSurface,
    lilac: source.bSurface,
    brand: source.accent,
    onBrand: source.onAccent,
  };
}

export function DemoBanner() {
  const c = usePalette();
  return <View style={[styles.demo, { backgroundColor: c.surface, borderColor: c.line }]}><Text style={[styles.demoText, { color: c.ink }]}>ローカルデモ — 架空データ・サーバー未接続</Text></View>;
}

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  const c = usePalette();
  const content = <View style={[styles.screen, { backgroundColor: c.canvas }]}>{children}</View>;
  return scroll
    ? <ScrollView style={{ backgroundColor: c.canvas }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">{content}</ScrollView>
    : content;
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.72 }, disabled && { opacity: 0.4 }]}><Text style={styles.primaryText}>{label}</Text></Pressable>;
}

export function ChoiceButton({ label, selected, onPress, tone = 'plain' }: { label: string; selected?: boolean; onPress: () => void; tone?: 'a' | 'b' | 'plain' }) {
  const c = usePalette();
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, { backgroundColor: tone === 'a' ? c.lime : tone === 'b' ? c.lilac : c.surface, borderColor: selected ? c.ink : c.line, borderWidth: selected ? 3 : 1 }]}><Text style={[styles.choiceText, { color: c.ink }]}>{label}{selected ? '　✓' : ''}</Text></Pressable>;
}

export function StatePanel({ kind = 'empty', children, onRetry }: { kind?: 'loading' | 'empty' | 'error'; children: ReactNode; onRetry?: () => void }) {
  const c = usePalette();
  return <View style={[styles.panel, { backgroundColor: c.surface }]}><Text style={[styles.body, { color: c.ink }]}>{kind === 'loading' ? '読み込んでいます…' : children}</Text>{kind === 'error' && onRetry ? <Pressable onPress={onRetry}><Text style={[styles.link, { color: c.ink }]}>もう一度試す</Text></Pressable> : null}</View>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  const c = usePalette();
  return <View style={[styles.section, { borderColor: c.line }]}><Text style={[styles.sectionTitle, { color: c.ink }]}>{title}</Text>{children}</View>;
}

export const s = StyleSheet.create({
  eyebrow: { ...typography.label, color: designColors.light.muted, marginBottom: space.xs },
  title: { ...typography.question },
  body: { ...typography.body },
});

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: space.page, paddingTop: space.page, paddingBottom: space.lg },
  demo: { borderWidth: 1, padding: space.xs, borderRadius: radius.small, marginBottom: space.narrowPage },
  demoText: { ...typography.caption, fontWeight: '700', textAlign: 'center' },
  primary: { minHeight: size.primaryButton, borderRadius: radius.primary, backgroundColor: designColors.light.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.page, marginTop: space.page },
  primaryText: { ...typography.body, fontWeight: '800', color: designColors.light.onAccent },
  choice: { minHeight: size.primaryButton, borderRadius: radius.primary, padding: space.narrowPage, justifyContent: 'center', marginTop: space.xs },
  choiceText: { ...typography.body, fontWeight: '700' },
  panel: { borderRadius: radius.input, padding: space.md, marginTop: space.md },
  body: { ...typography.body },
  link: { ...typography.label, textDecorationLine: 'underline', marginTop: space.sm },
  section: { borderTopWidth: 1, paddingVertical: space.page },
  sectionTitle: { ...typography.section, marginBottom: space.sm },
});
