import { StyleSheet, Text, type TextProps } from 'react-native';
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
        const flattened = StyleSheet.flatten([typeStyle, style]);
        const baseFontSize = flattened.fontSize ?? 16;

        //making the line height grow if the user chooses large text
        const ownStyle = StyleSheet.flatten(style) || {};
        const baseLineHeight = ownStyle.fontSize && !ownStyle.lineHeight ? undefined : flattened.lineHeight;
        const { lineHeight: _ignored, ...restOfStyle } = flattened;

  return (
    <Text
      style={[
        { color },
        restOfStyle,
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
