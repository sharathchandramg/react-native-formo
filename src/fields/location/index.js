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
                    this.setState({ isPickingLocation: false })
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
            let scheme = Platform.select({ ios: 'maps:http://maps.apple.com/?q=', android: 'geo:http://maps.google.com/?q=' });
            let latLng = `${position.latitude},${position.longitude}`;
            let label = 'You here';
            let url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            })
            this.setState({
                url : url,
                isPickingLocation: false,
            },()=> this.props.updateValue(this.props.attributes.name,{lat:position.latitude,long:position.longitude}))
        }
    }

    renderPostionUrl =(attributes)=>{
        let url = null;
        if(typeof attributes.value !=='undefined' && attributes.value !== null ){
            let scheme = Platform.select({ ios: 'maps:http://maps.apple.com/?q=', android: 'geo:http://maps.google.com/?q=' });
            let latLng = `${attributes.value.lat},${attributes.value.long}`;
            let label = 'You here';
            url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            })
        }else{
            url = this.state.url;
        }
        
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
            return <Text style={styles.textStyle} numberOfLines={1}>{this.state.isPickingLocation?'Picking...':''}</Text> 
        }
    }

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <ListItem style={{ borderBottomWidth: 0, paddingVertical:5,marginLeft:20 }}>
                <View style={{flexDirection:'row',flex:2}}>
                    <Text style={{flex:1,color: theme.inputColorPlaceholder,paddingStart:5 }}>{attributes.label}</Text>
                    <View style={{flexDirection:'row',flex:1}}>
                        {this.renderPostionUrl(attributes)}
                    </View>
                </View>
            </ListItem>
        );

    }
}