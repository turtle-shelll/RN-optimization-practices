import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';

// 1. Define the props that map strictly to our Android/iOS native code
interface NativeCustomButtonProps extends ViewProps {
  text: string;
  color: string;
  onCustomClick?: (event: any) => void;
}

// 2. Require the Native Component. 
// "CustomButton" MUST exactly match the getName() in Android and RCT_EXPORT_MODULE in iOS!
const CustomButtonNative = requireNativeComponent<NativeCustomButtonProps>('CustomButton');

// 3. Export a clean TypeScript wrapper for the rest of the app to use
export const NativeCustomButton: React.FC<NativeCustomButtonProps> = (props) => {
  return (
    <CustomButtonNative
      {...props}
      // We can intercept the native event payload here if we want to clean it up before passing it up
      onCustomClick={(event) => {
        if (props.onCustomClick) {
          props.onCustomClick(event.nativeEvent.message);
        }
      }}
    />
  );
};
