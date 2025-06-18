/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#000',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  primary: '#a264df',         // Roxo vibrante — botões, destaques
  background: '#1E1E6F',      // Azul escuro — fundo geral do app
  inputBackground: '#f0f0f2', // Cinza claro — campos de texto
  textPrimary: '#ffffff',     // Branco — títulos, textos principais
  textSecondary: '#cccccc',   // Cinza claro — legendas, descrições
};
