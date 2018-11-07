
import PropTypes from "prop-types";
import React,{Component} from "react";

import {
	ActionSheetIOS,
	View,
	Text,
	Animated,
	Platform,
	TouchableOpacity
} from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import BottomSheet from "react-native-js-bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";

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
			overflow: "visible"
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
                overflow: "hidden" 
            }, () =>this._startAnimation());
        
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
        ) && this.bottomSheet.close()
    }
    _openPicker =()=>{
        ImagePicker.openPicker({
            compressImageMaxWidth:360,
            compressImageMaxHeight:360,
            compressImageQuality: 1.0,
            includeBase64: true,
        }).then(image =>
            this._getImageFromStorage(image.path)
        ) && this.bottomSheet.close()
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
		const options = this.props.options.config.options || this.defaultProps.options;
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
					source={{ uri:attributes? attributes.value: this.state.path}}
					style={[styles.image,{height: this.state.height}]}
				/>
				<View style={[styles.container,{overflow: this.state.overflow}]}>
                    <Icon name="image" size={24} type={'regular'} color ={'#828282'}/>
				</View>
			</TouchableOpacity>
		);
    };

    
    render(){
        const { theme, attributes, ErrorComponent } = this.props;

        return (
            <View>
                <Text style={{ marginLeft:20,padding:5,color: theme.inputColorPlaceholder }}>{attributes.label}</Text>
                {this.renderPreview(attributes)}

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
                <ErrorComponent {...{ attributes, theme }} />
            </View>
        );
    }
}


