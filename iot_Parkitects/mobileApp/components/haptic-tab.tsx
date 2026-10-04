import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useAccessibility } from '@/context/accessibilityContext';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { triggerHaptic, triggerScreenReader } = useAccessibility();
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        //only vibrates and speaks when the user has those settings turned on
        triggerHaptic();
        if (props.accessibilityLabel) triggerScreenReader(props.accessibilityLabel);
        props.onPressIn?.(ev);
      }}
    />
  );
}