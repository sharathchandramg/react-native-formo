import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Animated,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import { View, ListItem, Text, Item } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../utils/validators';
import _ from 'lodash';
const DEVICE_WIDTH = Dimensions.get('window').width;
import StarIcon from '../../components/starIcon';
import ZoomImage from '../../components/zoomImage';
import SignatureCapture from 'react-native-signature-capture';
const moment = require('moment');

export default class SignatureField extends Component {
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
        this.myRef = React.createRef();
        this.state = {
            openImageModal: false,
            imgDetails: null,
            viewMode: 'portrait',
            signature: null
        };
    }

    componentDidMount() {
        this.isLocal = false;
        this.isFirstTime = true;
    }

    componentDidUpdate(prevProps) {
        if (this.isFirstTime && !this.isLocal) {
            const { handleDocumentUpdateAndDownload, attributes } = this.props;
            const { value } = attributes;
            if (
                typeof handleDocumentUpdateAndDownload === 'function' &&
                !isEmpty(value)
            ) {
                handleDocumentUpdateAndDownload(
                    attributes,
                    value,
                    (actionType = 'read'),
                    this.isFirstTime
                );
                this.isFirstTime = false;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    openImageModalView = value => {
        this.setState({
            imgDetails: value,
            openImageModal: true,
        });
    };

    renderImageItem = ({ item }) => {
        return (
            <View
                style={{
                    height: 150,
                    width: parseInt(DEVICE_WIDTH - 20),
                    paddingEnd: 5,
                }}
                key={item['uri']}
            >
                <TouchableOpacity
                    style={{
                        height: 150,
                        width: parseInt(DEVICE_WIDTH - 20),
                        paddingEnd: 5,
                    }}
                    onPress={() => this.openImageModalView(item)}
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
                </TouchableOpacity>
            </View>
        );
    };

    renderImageList = images => {
        if (!isEmpty(images)) {
            return (
                <View style={styles.hScrollView}>
                    <FlatList
                        horizontal={true}
                        data={images}
                        extraData={this.props}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderImageItem}
                        nestedScrollEnabled={true}
                        ref={ref => {
                            this.flatListRef = ref;
                        }}
                    />
                </View>
            );
        }
        return null;
    };

    saveSign = () => {
        this.myRef.current.saveImage();
    };

    resetSign = () => {
        this.myRef.current.resetImage();
    };


    getUpdatedPath=(filePath)=>{
        const splitPath=filePath?filePath.split('/'):[];
        if(splitPath.length>0){
            splitPath[splitPath.length-1] = `signature_${moment().utc().valueOf()}.png`;
        }
        return splitPath.join('/');
    }

    _onSaveEvent = result => {
        const { attributes, handleDocumentUpdateAndDownload } = this.props;
        this.setState({ signature: result, viewMode: 'portrait' }, () => {
            this.closeImageModalView();
        });

        if (typeof handleDocumentUpdateAndDownload === 'function') {
            const filePath = Platform.OS.match(/ios/i)
                ? result['pathName'].replace('file://', '', 1)
                : result['pathName'];
            handleDocumentUpdateAndDownload(
                attributes,
                [
                    {
                        mime_type: 'image/png',
                        file_path: this.getUpdatedPath(filePath),
                        base64_data: result['encoded'],
                    },
                ],
                (actionType = 'write')
            );
        }
    };

    getImguri = (item, isFromLocal = false) => {
        if (isFromLocal) {
            return `data:image/png;base64,${item['encoded']}`;
        } else if (!isEmpty(item['base64Data']))
            return `data:image/png;base64,${item['base64Data']}`;
        else return item['url'];
    };

    renderPreview = attributes => {
        const value = attributes.value;
        const signatureObj = this.state.signature;

        let data = [];
        if (!isEmpty(signatureObj)) {
            data.push({
                uri: this.getImguri(signatureObj, true),
                priority: FastImage.priority.normal,
                headers: {
                    'content-type': 'image/png',
                },
            });
        } else if (
            !isEmpty(value) &&
            (_.some(value, 'url') || _.some(value, 'base64Data'))
        ) {
            data.push({
                uri: this.getImguri(value[0]),
                priority: FastImage.priority.normal,
                headers: {
                    'content-type': 'image/png',
                },
            });
        }

        return (
            <View style={[styles.topContainer, { borderColor: '#a94442' }]}>
                <Animated.View style={{ flex: 1, flexDirection: 'row' }}>
                    {data && data.length ? (
                        this.renderImageList(data)
                    ) : (
                        <View />
                    )}
                </Animated.View>
            </View>
        );
    };

    renderAddImageIcon = () => {
        return (
            <TouchableOpacity
                style={styles.valueContainer}
                onPress={() =>
                    this.setState({
                        openImageModal: true,
                        viewMode: 'portrait',
                    })
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

    checkImageData = () => {
        const value = this.props.attributes['value'] || '';
        if (!isEmpty(this.state.signature) || !isEmpty(value)) {
            return true;
        }
        return false;
    };

    closeImageModalView = () => {
        this.setState({
            imgDetails: null,
            openImageModal: false,
            viewMode: 'portrait',
        });
    };

    renderModalContent = item => {
        return (
            <View style={styles.modalContent}>
                <TouchableOpacity
                    style={[styles.modalHeader, { backgroundColor: 'black' }]}
                    onPress={() => this.closeImageModalView()}
                >
                    <Text style={styles.modalHeaderTitle}>{`Close`}</Text>
                </TouchableOpacity>
                {item ? (
                    <View style={styles.imageWrapper}>
                        <ZoomImage
                            item={item}
                            closeModal={this.closeImageModalView}
                            backgroundColor="white"
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </View>
                ) : (
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <SignatureCapture
                            style={{
                                flex: 1,
                                borderColor: '#000033',
                                borderWidth: 1,
                            }}
                            ref={this.myRef}
                            onSaveEvent={this._onSaveEvent}
                            saveImageFileInExtStorage={false}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            viewMode={this.state.viewMode}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.saveSign()}
                            >
                                <Text>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.resetSign()}
                            >
                                <Text>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
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
                            <Item
                                error={
                                    theme.changeTextInputColorOnError
                                        ? attributes.error
                                        : null
                                }
                                style={{ paddingVertical: 10 }}
                            >
                                {attributes['required'] && (
                                    <StarIcon
                                        required={attributes['required']}
                                    />
                                )}
                                <Text
                                    style={{
                                        flex: 1,
                                        color: theme.inputColorPlaceholder,
                                        paddingStart: 5,
                                    }}
                                >
                                    {attributes.label}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                    }}
                                    onPress={() =>
                                        this.setState({
                                            openImageModal: true,
                                            viewMode: 'portrait',
                                        })
                                    }
                                >
                                    {this.renderAddImageIcon()}
                                </TouchableOpacity>
                            </Item>
                        </View>
                    </ListItem>
                    {this.checkImageData() ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                            }}
                        >
                            {this.renderPreview(attributes)}
                        </View>
                    ) : null}

                    {this.state.openImageModal && (
                        <Modal
                            isVisible={this.state.openImageModal}
                            animationType={'fade'}
                            transparent={true}
                            onRequestClose={() => this.closeImageModalView()}
                            onPressOut={() => this.closeImageModalView()}
                        >
                            {this.renderModalContent(this.state.imgDetails)}
                        </Modal>
                    )}
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
