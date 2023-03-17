import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles.js';

export default ImageButton = ({ imageSource, style, onPress }) => {
    //const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={imageSource} style={style} />
        </TouchableOpacity>
    );
};