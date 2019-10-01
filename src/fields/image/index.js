import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
    ActionSheetIOS,
    Animated,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { View, ListItem, Text } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'react-native-js-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../utils/validators';

export default class ImageField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.isLocal = false;
        this.isFirstTime = true;
        this.state = {
            image: undefined,
            height: new Animated.Value(0),
        };
    }

    componentDidMount(){
        this.isLocal = false;
        this.isFirstTime = true;
    }

    componentDidUpdate(prevProps) {
        if (this.isFirstTime && !this.isLocal) {
            const { handleGetSignedUrl, attributes } = this.props;
            const { value } = attributes;
            if (
                typeof handleGetSignedUrl === 'function' &&
                value !== null &&
                value['filePath']
            ) {
                handleGetSignedUrl(attributes, value);
                this.isFirstTime = false;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    _startAnimation = () => {
        Animated.sequence([
            Animated.timing(this.state.height, {
                toValue: 0,
                duration: 250,
            }),
            Animated.timing(this.state.height, {
                toValue: 150,
                duration: 500,
                delay: 75,
            }),
        ]).start();
    };

    _getImageFromStorage = image => {
        const { attributes } = this.props;
        let filePath = '';
        if (Platform.OS.match(/ios/i)) {
            filePath = image['path'].replace('file://', '', 1);
        } else {
            filePath = image['path'];
        }

        let imageObj = {
            contentType: image['mime'],
            filePath: filePath,
            data: image['data'],
        };

        this.setState(
            {
                image: imageObj,
            },
            () => {
                if (Platform.OS !== 'ios') this.bottomSheet.close();
                this._startAnimation();
                this.isLocal = true;
            }
        );
        this.props.updateValue(attributes.name, imageObj);
    };

    _openCamera = () => {
        
        const {mode} = this.props.attributes;
        let config = null;
        if(!isEmpty(mode) && mode.match(/high-resolution/i)){
            config ={
                compressImageMaxWidth:1080,
                compressImageMaxHeight:1080,
                includeBase64: true,
            }
        }else{
            config ={
                compressImageMaxWidth:360,
                compressImageMaxHeight:360,
                includeBase64: true,
            }
        }
        ImagePicker.openCamera(config)
            .then(image => this._getImageFromStorage(image))
            .catch(e => {
                if (Platform.OS !== 'ios') this.bottomSheet.close();
                console.log(e);
            });
    };
    _openPicker = () => {

        const {mode} = this.props.attributes;
        let config = null;
        if(!isEmpty(mode) && mode.match(/high-resolution/i)){
            config ={
                compressImageMaxWidth:1080,
                compressImageMaxHeight:1080,
                includeBase64: true,
            }
        }else{
            config ={
                compressImageMaxWidth:360,
                compressImageMaxHeight:360,
                includeBase64: true,
            }
        }

        ImagePicker.openPicker(config)
            .then(image => {
                this._getImageFromStorage(image)
            })
            .catch(e => {
                if (Platform.OS !== 'ios') this.bottomSheet.close();
                console.log(e);
            });
    };

    _renderOptions = () => {
        const options = ['Open camera', 'Select from the gallery', 'Cancel'];

        return [
            {
                title: options[0],
                onPress: () => this._openCamera(),
                icon: (
                    <Icon
                        name="camera"
                        size={24}
                        type={'regular'}
                        color={'#828282'}
                    />
                ),
            },
            {
                title: options[1],
                onPress: () => this._openPicker(),
                icon: (
                    <Icon
                        name="image"
                        size={24}
                        type={'regular'}
                        color={'#828282'}
                    />
                ),
            },
        ];
    };

    _onPressImage = () => {
        const options = ['Open camera', 'Select from the gallery', 'Cancel'];
        ActionSheetIOS.showActionSheetWithOptions(
            { options, cancelButtonIndex: 2 },
            buttonIndex => {
                if (buttonIndex === 0) {
                    this._openCamera();
                } else if (buttonIndex === 1) {
                    this._openPicker();
                }
            }
        );
    };

    renderPreview = attributes => {
        const value = attributes.value;
        const image = this.state.image;
        let source = {
            uri: '',
            priority: FastImage.priority.normal,
        };
        if (!isEmpty(value) && !isEmpty(value['url'])) {
            source['uri'] = value['url'];
            source['headers'] = {
                'content-type': value['contentType'],
            };
        } else if (!isEmpty(image) && !isEmpty(image['filePath'])) {
            source['uri'] = image['filePath'];
        }
        return (
            <TouchableOpacity
                style={[styles.topContainer, { borderColor: '#a94442' }]}
                onPress={
                    Platform.OS === 'ios'
                        ? this._onPressImage
                        : () => this.bottomSheet.open()
                }
            >
                <Animated.View
                    style={{ flex: 1, height: undefined, width: undefined }}
                >
                    <FastImage
                        style={{ flex: 1, height: undefined, width: undefined }}
                        resizeMode={FastImage.resizeMode.cover}
                        source={source}
                    />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    renderAddImageIcon = () => {
        return (
            <TouchableOpacity
                style={styles.valueContainer}
                onPress={
                    Platform.OS === 'ios'
                        ? this._onPressImage
                        : () => this.bottomSheet.open()
                }
            >
                <Icon
                    name="image"
                    size={24}
                    type={'regular'}
                    color={'#828282'}
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        );
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View>
                <View>
                    <ListItem
                        style={{
                            borderBottomWidth: 0,
                            paddingVertical: 5,
                            marginLeft: 20,
                        }}
                    >
                        <View style={{ flexDirection: 'row', flex: 2 }}>
                            <Text
                                style={{
                                    flex: 1,
                                    color: theme.inputColorPlaceholder,
                                    paddingStart: 5,
                                }}
                            >
                                {attributes.label}
                            </Text>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                {this.renderAddImageIcon()}
                            </View>
                        </View>
                    </ListItem>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        {typeof this.state.image !== 'undefined' ||
                        attributes.value !== null
                            ? this.renderPreview(attributes)
                            : null}
                    </View>
                    {Platform.OS === 'android' ? (
                        <BottomSheet
                            ref={ref => {
                                this.bottomSheet = ref;
                            }}
                            title={'Choose image from'}
                            options={this._renderOptions()}
                            coverScreen={true}
                            titleFontFamily={styles.titleFontFamily}
                            styleContainer={styles.styleContainer}
                            fontFamily={styles.fontFamily}
                        />
                    ) : null}
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
