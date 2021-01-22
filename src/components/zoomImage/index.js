import React from 'react';
import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const ImageView = props => {
        const item = props.item;
        return (
            <ImageZoom
                cropWidth={deviceWidth}
                cropHeight={deviceHeight}
                imageWidth={deviceWidth - 20}
                imageHeight={'95%'}
                enableSwipeDown={true}
                onSwipeDown={() => props.closeModal()}
                style={{ marginTop: '10%' }}
            >
                <FastImage
                    style={{ flex: 1 }}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                        uri: item['uri'],
                        headers: item['headers'] || {},
                        priority: item['priority'],
                    }}
                />
            </ImageZoom>
    );
};

export default ImageView;
