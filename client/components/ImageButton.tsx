import React from "react";
import { Image, ImageSourcePropType, ImageStyle, StyleProp, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface IImageButtonProps extends TouchableOpacityProps {
  imageSource: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
}

export default function ImageButton({ imageSource, style, onPress }: IImageButtonProps): JSX.Element {
	return (
		<TouchableOpacity onPress={onPress}>
			<Image source={imageSource} style={style} />
		</TouchableOpacity>
	);
}
