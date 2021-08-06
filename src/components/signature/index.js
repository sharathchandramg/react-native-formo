import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Animated,
    TouchableOpacity,
    FlatList,
    Dimensions,
    TouchableHighlight,
    Modal
} from 'react-native';
import { View, ListItem, Text, Item } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../utils/validators';
import _ from 'lodash';
const DEVICE_WIDTH = Dimensions.get('window').width;
import StarIcon from "../../components/starIcon";
import ZoomImage from './../../components/zoomImage';
import SignatureCapture from 'react-native-signature-capture';


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
            imageArray: undefined,
            height: new Animated.Value(0),
            stepIndex: 0,
            openImageModal:false,
            imgDetails:null,
            viewMode:'portrait',
            canvasSignature:null
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
    _nextScrollIndex = () => {
        const { stepIndex, imageArray } = this.state;
        const { attributes } = this.props;
        let currentFlatlistIndex = stepIndex;
        const len =
            !isEmpty(imageArray) && Array.isArray(imageArray)
                ? imageArray.length
                : !isEmpty(attributes['value']) &&
                  Array.isArray(attributes['value'])
                ? attributes['value'].length
                : 0;
        if (currentFlatlistIndex < len - 1) {
            currentFlatlistIndex = currentFlatlistIndex + 1;
            this.flatListRef.scrollToIndex({
                index: currentFlatlistIndex,
                animated: true,
            });
            this.setState({ stepIndex: currentFlatlistIndex });
        } else {
            currentFlatlistIndex = 0;
            this.flatListRef.scrollToIndex({
                index: currentFlatlistIndex,
                animated: true,
            });
            this.setState({ stepIndex: currentFlatlistIndex });
        }
    };

    
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
                    {images.length > 1 && (
                        <View style={styles.moreIconContainer}>
                            <TouchableHighlight
                                style={styles.moreIconOuter}
                                onPress={() => this._nextScrollIndex()}
                                activeOpacity={0.0}
                                underlayColor={'white'}
                            >
                                <View style={styles.moreIconInner}>
                                    <Icon
                                        name={'arrow-right'}
                                        type="regular"
                                        size={18}
                                        color={'#0097eb'}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                    )}
                </View>
            );
        }
        return null;
    };

    saveSign=() =>{
        console.log('saveSignsaveSignsaveSignsaveSign');
        this.refs["sign"].saveImage();
    }

    resetSign=()=> {
        this.refs["sign"].resetImage();
    }

    _onSaveEvent=(result)=> {
        this.setState({signature:result,viewMode:'portrait'},()=>{
            this.closeImageModalView()
        });
    }

    getImguri=()=>{
        // if(!isEmpty(item['base64Data']))
            return `data:image/png;base64,${this.state.signature['encoded']}`;
        // else 
        //     return item['url']
    }

    renderPreview = attributes => {
        const value = attributes.value;
        const imageArray = this.state.imageArray;

        let data = [];
        // if (!isEmpty(imageArray) && _.some(imageArray, 'file_path')) {
        //     _.forEach(imageArray, image => {
        //         data.push({
        //             uri: image['file_path'],
        //             priority: FastImage.priority.normal,
        //         });
        //     });
        // } else if (!isEmpty(value) && (_.some(value, 'url')||_.some(value, 'base64Data'))) {
        //     _.forEach(value, image => {
                data.push({
                    uri: this.getImguri(),
                    priority: FastImage.priority.normal,
                    headers: {
                        'content-type':
                            "image/png",
                    },
                });
        //     });
        // }

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
                onPress={() => this.setState({ openImageModal: true,viewMode:'portrait'})}
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
        if (!isEmpty(this.state.signature)) {
            return true;
        }
        return false;
    };

    closeImageModalView = () => {
        this.setState({
            imgDetails: null,
            openImageModal: false,
            viewMode:'portrait'
        });
    };

    renderModalContent = item => {
        return (
            <View style={[styles.modalContent,{backgroundColor:'white'}]}>
                <TouchableOpacity
                    style={[styles.modalHeader,{backgroundColor:'black'}]}
                    onPress={() =>this.closeImageModalView()}
                >
                    <Text style={styles.modalHeaderTitle}>{`Close`}</Text>
                </TouchableOpacity>
                {item ?
                    <View style={styles.imageWrapper}>
                    <ZoomImage
                        item={item}
                        closeModal={this.closeImageModalView}
                        style={{
                            width:'100%',
                            height:'100%'
                        }}
                    />
                </View>:
                <View  style={{ flex: 1, flexDirection: "column" }}>
                    <SignatureCapture
                        style={{
                            flex: 1,
                            borderColor: '#000033',
                            borderWidth: 1,
                        }}
                        ref="sign"
                        onSaveEvent={this._onSaveEvent}
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        viewMode={this.state.viewMode}
                    />
                <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight style={styles.button} onPress={() => this.saveSign()} >
                        <Text>Save</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={() => this.resetSign()}>
                        <Text>Reset</Text>
                    </TouchableHighlight>

                </View>
                </View> }
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
                            <Item error={theme.changeTextInputColorOnError ? attributes.error : null} style={{paddingVertical:10}}>
                                {attributes['required'] && <StarIcon required={attributes['required']} />}
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
                                        onPress={() => this.setState({ openImageModal: true,viewMode:'portrait'})}
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