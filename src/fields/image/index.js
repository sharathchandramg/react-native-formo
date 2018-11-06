import React from "react";
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
import FontAwesome, { Icons } from 'react-native-fontawesome';
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
                icon: (<FontAwesome>{Icons.camera}</FontAwesome>)
			},
			{
				title: options[1],
				onPress: () =>this._openPicker(),
				icon: ( <FontAwesome>{Icons.image}</FontAwesome>)
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
				<View style={[styles.container,{overflow: this.state.overflow,backgroundColor: "#E28E8E"}]}>
                    <FontAwesome>{Icons.camera}</FontAwesome>
				</View>
			</TouchableOpacity>
		);
    };

    
    render(){
        const { theme, attributes, ErrorComponent } = this.props;

        return (
            <View style={{height:150,justifyContent:'flex-start',alignItems:'center'}}>
                <View style={{height:30,justifyContent:'flex-start',alignItems:'center'}}>
                    <Text style={{ color: theme.inputColorPlaceholder }}>{attributes.label}</Text>
                </View>
                <View style={{height:100,justifyContent:'flex-start',alignItems:'center'}}>
                    {this.renderPreview(attributes)}
                </View>
                {Platform.OS === "android" ? (
                    <BottomSheet
                        ref={ref => {
                            this.bottomSheet = ref;
                        }}
                        title={attributes.label}
                        options={this._renderOptions()}
                        coverScreen={true}
                        titleFontFamily={style.titleFontFamily}
                        styleContainer={style.styleContainer}
                        fontFamily={style.fontFamily}
                    />
                ) : null}
                <ErrorComponent {...{ attributes, theme }} />
            </View>
        );
    }
}


