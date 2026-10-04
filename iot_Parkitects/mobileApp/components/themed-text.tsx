import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { useAccessibility } from '@/context/accessibilityContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { scale } = useAccessibility();

  const typeStyle = 
        type === 'title' ? styles.title : 
        type === 'defaultSemiBold' ? styles.defaultSemiBold : 
        type === 'subtitle' ? styles.subtitle :
        type === 'link' ? styles.link : 
        styles.default;
  
        //merging the typeStyle defaults with preferences picked
        const flattened = (StyleSheet.flatten([typeStyle, style]) || {}) as TextStyle;
        const ownStyle = (StyleSheet.flatten(style) || {}) as TextStyle;
        const baseFontSize = flattened.fontSize ?? 16;
        const { lineHeight: flatLineHeight, ...flatRest } = flattened;
        const baseLineHeight = ownStyle.fontSize && !ownStyle.lineHeight ? undefined : flatLineHeight;

  return (
    <Text
      style={[
        { color },
        flatRest,
        { fontSize: baseFontSize * scale },
        baseLineHeight ? { lineHeight: baseLineHeight * scale } : null,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
