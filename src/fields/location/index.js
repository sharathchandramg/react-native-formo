import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform,Alert,TouchableOpacity,Linking } from "react-native";
import { View, Item, Input, Icon, ListItem, Text } from "native-base";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import { getGeoLocation,requestLocationPermission } from "./../../utils/helper";
import styles from "./styles";

const GPS_ALERT_MESSAGE = "Poor GPS accuracy. Wait until accuracy improves";
const GPS_ALERT = "GPS Accuracy Alert";

export default class LocationField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        onSummitTextInput: PropTypes.func,
        ErrorComponent: PropTypes.func,
        updateValue: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state={
            isPickingLocation:true,
            url :null,
        }
    }

    componentDidMount() {
        let {required} = this.props.attributes;
        if(required){
            this.promptForEnableLocationIfNeeded();
        }else {
            this.setState({ isPickingLocation: false })
        }
    }
    
    promptForEnableLocationIfNeeded = () => {
        if(Platform.OS === 'android') {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                .then(data => {
                    this.pickLocation();
                }).catch(err => {
                    console.log(err)
                });
        }else {
            this.pickLocation();
        }
    }

    pickLocation = () => {
        requestLocationPermission().then(response => {
            if(response.permission){
                getGeoLocation({ highAccuracy: true, timeout: 10000 }, (position, err) => {
                    if (err){
                        this.locationPickupFailure(err);
                    }else{
                        this.locationPickupSuccess(position)
                    }
                });
            }else{
                this.locationPickupFailure(response.err)
            }
        }).catch(response => this.locationPickupFailure(response.err))
    }

    locationPickupFailure = (err) => {
        if (err) {
            Alert.alert(GPS_ALERT,GPS_ALERT_MESSAGE,
                [
                    {
                        text: 'Exit',
                        onPress: () => this.setState({ isPickingLocation: false },()=>console.log('cancel')),
                        style: 'cancel'
                    },
                    {},
                    {
                        text: 'Retry',
                        onPress: () => this.pickLocation(),
                        style: 'ok'
                    },
                ],
                { cancelable: false }
            )
        }
    }

    locationPickupSuccess = (position) => {
        if (typeof position !== 'undefined' && position !== null) {
            let url = Platform.select({
                ios: `http://maps.apple.com/?ll=${position.latitude},${position.longitude}`,
                android: `http://maps.google.com/?q=${position.latitude},${position.longitude}`
            });
            this.setState({
                url : url,
                isPickingLocation: false,
            })
        }
    }

    handleChange(text) {
        this.props.updateValue(this.props.attributes.name, text);
    }

    renderPostionUrl =(attributes)=>{
        let url = attributes.value? attributes.value: this.state.url;
        if(url){
            return (
                <TouchableOpacity style={styles.valueContainer}
                    onPress={() => {
                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                return Linking.openURL(url);
                            }
                        }).catch(err => {
                            console.error('An error occurred', err);
                        });
                    }}>
                        <Text style={styles.textStyle} numberOfLines={1}>{url}</Text>
                </TouchableOpacity>
            );
        }else{
            return <Text style={styles.textStyle} numberOfLines={1}>{'Picking...'}</Text> 
        }
    }

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
                <View style={{flexDirection:'row',flex:2,}}>
                    <Text style={{flex:1,color: theme.inputColorPlaceholder }}>{attributes.label}</Text>
                    <View style={{flexDirection:'row',flex:1}}>
                        {this.renderPostionUrl(attributes)}
                    </View>
                </View>
            </ListItem>
        );

    }
}