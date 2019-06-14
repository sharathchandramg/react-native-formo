
import PropTypes from "prop-types";
import React,{Component} from "react";

import {
	ActionSheetIOS,
    Animated,
    Image,
	Platform,
	TouchableOpacity
} from "react-native";

import { View, ListItem, Text } from "native-base";

import ImagePicker from "react-native-image-crop-picker";
import BottomSheet from "react-native-js-bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import StarIcon from "../../components/starIcon";

export default class ImageField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    }

    constructor(props) {
		super(props);
		this.state = {
			path: undefined,
			height: new Animated.Value(0),
		};
	}

    shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

    _startAnimation = () => {
		Animated.sequence([
			Animated.timing(this.state.height, {
				toValue: 0,
				duration: 250
			}),
			Animated.timing(this.state.height, {
				toValue: 150,
				duration: 500,
				delay: 75
			})
		]).start();
	};



	_getImageFromStorage = (value) => {
        this.setState({
                path: value, 
            }, () =>{
                if(Platform.OS !== "ios") this.bottomSheet.close();
                this._startAnimation()
            });
        
        this.props.updateValue(this.props.attributes.name, value);
    };
    
    _openCamera =()=>{
        ImagePicker.openCamera({
            compressImageMaxWidth:360,
            compressImageMaxHeight:360,
            compressImageQuality: 1.0,
            includeBase64: true,
        }).then(image =>
            this._getImageFromStorage(image.path)
        ).catch(e => {
            if(Platform.OS !== "ios") this.bottomSheet.close();
            console.log(e)
        }) 
    }
    _openPicker =()=>{
        ImagePicker.openPicker({
            compressImageMaxWidth:360,
            compressImageMaxHeight:360,
            compressImageQuality: 1.0,
            includeBase64: true,
        }).then(image =>
            this._getImageFromStorage(image.path)
        ).catch(e => {
            if(Platform.OS !== "ios") this.bottomSheet.close();
            console.log(e)
        }) 
    }

    _renderOptions = () => {
        const options =["Open camera","Select from the gallery","Cancel"];
    
		return [
            {
				title: options[0],
                onPress: () => this._openCamera(),
                icon: (<Icon name="camera" size={24} type={'regular'} color ={'#828282'}/>)
			},
			{
				title: options[1],
				onPress: () =>this._openPicker(),
				icon: ( <Icon name="image" size={24} type={'regular'} color ={'#828282'}/>)
			}
		];
	};

    _onPressImage = () => {
		const options =["Open camera","Select from the gallery","Cancel"];
		ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 2},
			buttonIndex => {
				if (buttonIndex === 0) {
					this._openCamera()
				} else if (buttonIndex === 1) {
					this._openPicker()
				}
			}
		);
	};





    renderPreview =(attributes) => {
        return (
            <TouchableOpacity style={[styles.topContainer,{ borderColor:"#a94442" }]}
                onPress={
                    Platform.OS === "ios"
                        ? this._onPressImage
                        : () => this.bottomSheet.open()
                }>
                <Animated.Image
                    resizeMode="cover"
                    source={{ uri:attributes.value? attributes.value: this.state.path}}
                    style={{flex:1, height: undefined, width: undefined}}
                />
            </TouchableOpacity>
        );
    };


    renderAddImageIcon = ()=>{
        return (
            <TouchableOpacity style={styles.valueContainer}
                onPress={
                    Platform.OS === "ios"
                        ? this._onPressImage
                        : () => this.bottomSheet.open()
                }>
                <Icon name="image" size={24} type={'regular'} color ={'#828282'} style={styles.iconStyle}/>
            </TouchableOpacity>
        );
    }

    
    render(){
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View>
                <View>
                    <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5,marginLeft:20 }}>
                        <View style={{flexDirection:'row',flex:2}}>
                            <Text style={{flex:1,color: theme.inputColorPlaceholder,paddingStart:5 }}>
                                {attributes['required'] && <StarIcon required={attributes['required']} />}
                                {attributes.label}
                            </Text>
                            <View style={{flexDirection:'row',flex:1}}>
                                {this.renderAddImageIcon()}
                            </View>
                        </View>
                    </ListItem>
                    <View style={{flexDirection:'row',flex:1}}>
                        {typeof this.state.path !=='undefined' || attributes.value !== null? this.renderPreview(attributes):null}
                    </View>
                    {Platform.OS === "android" ? (
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
