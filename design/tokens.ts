/** DECIDE visual tokens v1.5, preserving the v1.2 palette. Geometry uses dp/sp.
 * Product policy, privacy, deadlines and DNA logic stay outside visual tokens.
 */
export const colors = {
  light: {
    canvas: '#FFFFFF', surface: '#F4F5F6', ink: '#111214', muted: '#55575F',
    line: '#E3E4E8', control: '#767981', aSurface: '#ECF3CE', bSurface: '#E9E1FF',
    action: '#111214', onAction: '#FFFFFF', accent: '#D5FF45', onAccent: '#152000',
    profileCover: '#DBD0FF', danger: '#B42318',
  },
  dark: {
    canvas: '#101113', surface: '#1D1F23', ink: '#F5F5F7', muted: '#B3B5BE',
    line: '#35373D', control: '#979BA6', aSurface: '#343E23', bSurface: '#383049',
    action: '#F5F5F7', onAction: '#111214', accent: '#D5FF45', onAccent: '#152000',
    profileCover: '#3F3457', danger: '#FFB4AB',
  },
} as const;
export const space = { xxs: 4, pair: 6, xs: 8, sm: 12, narrowPage: 14, md: 16, page: 18, lg: 24, xl: 32 } as const;
export const radius = { small: 8, input: 12, primary: 14, option: 18, feature: 20, pill: 999 } as const;
export const typography = {
  display: { fontSize: 34, lineHeight: 44, fontWeight: '800' },
  question: { fontSize: 25, lineHeight: 35, fontWeight: '800' },
  textOption: { fontSize: 26, lineHeight: 36, fontWeight: '700' },
  photoOption: { fontSize: 19, lineHeight: 27, fontWeight: '700' },
  section: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
} as const;
export const size = {
  touchMin: 44, controlMin: 48, primaryButton: 52, icon: 24, compactIcon: 20,
  authorAvatar: 42, profileAvatar: 84, webPreviewMax: 414, photoAspectRatio: 1,
  textOptionMinHeight: 180,
} as const;
export const motion = { press: 100, state: 160, sheet: 240, reduced: 0 } as const;
export const profileThemes = ['lilac', 'lime', 'neutral'] as const;
export type ProfileTheme = typeof profileThemes[number];
export type ColorMode = keyof typeof colors;
export const defaultProfileTheme: ProfileTheme = 'lilac';
export function profileCover(theme: ProfileTheme, mode: ColorMode): string {
  const palette = colors[mode];
  return theme === 'lime' ? palette.aSurface : theme === 'neutral' ? palette.surface : palette.profileCover;
}
/** Never derive permissions from a color, selected state or visibility style. */
