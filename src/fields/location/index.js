import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, Alert, TouchableOpacity, Linking } from 'react-native';
import { View, ListItem, Text } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { isEmpty } from '../../utils/validators';

import {
    getGeoLocation,
    requestLocationPermission,
} from './../../utils/helper';

import styles from './styles';

const GPS_ALERT_MESSAGE = 'Poor GPS accuracy. Wait until accuracy improves';
const GPS_ALERT = 'GPS Accuracy Alert';
const IOS_LOCATION_SETTING_PATH =
    'Turn on location services from Settings->Privacy->location services';
const LOCATION_ALERT = 'This action required GPS location';

export default class LocationField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        onSummitTextInput: PropTypes.func,
        ErrorComponent: PropTypes.func,
        updateValue: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            isPickingLocation: true,
            url: null,
        };
    }

    componentDidMount() {
        const { value } = this.props.attributes;
        if (isEmpty(value) && isEmpty(value['lat']) && isEmpty(value['long'])) {
            this.promptForEnableLocationIfNeeded();
        } else {
            this.setState({ isPickingLocation: false });
        }
    }

    promptForEnableLocationIfNeeded = () => {
        if (Platform.OS === 'android') {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
            })
                .then(data => {
                    this.pickLocation();
                })
                .catch(err => {
                    const { attributes, navigation } = this.props;
                    if (
                        attributes['required'] &&
                        typeof navigation !== 'undefined'
                    ) {
                        Alert.alert(
                            LOCATION_ALERT,
                            'Turn on location services from Settings'
                        );
                        navigation.goBack(null);
                    } else if (!attributes['required']) {
                        this.pickLocation();
                    } else {
                        this.setState({ isPickingLocation: false });
                    }
                });
        } else {
            this.pickLocation();
        }
    };

    pickLocation = () => {
        if (Platform.OS === 'android') {
            requestLocationPermission()
                .then(response => {
                    if (response.permission) {
                        getGeoLocation(
                            { highAccuracy: true, timeout: 10000 },
                            (position, err) => {
                                if (err) {
                                    this.locationPickupFailure(err);
                                } else {
                                    this.locationPickupSuccess(position);
                                }
                            }
                        );
                    } else {
                        this.locationPickupFailure(response.err);
                    }
                })
                .catch(response => this.locationPickupFailure(response.err));
        } else {
            getGeoLocation(
                { highAccuracy: true, timeout: 10000 },
                (position, err) => {
                    if (err) {
                        const { attributes, navigation } = this.props;
                        if (
                            attributes['required'] &&
                            typeof navigation !== 'undefined'
                        ) {
                            Alert.alert(
                                LOCATION_ALERT,
                                IOS_LOCATION_SETTING_PATH
                            );
                            navigation.goBack(null);
                        } else {
                            locationPickupFailure(err);
                        }
                    } else {
                        this.locationPickupSuccess(position);
                    }
                }
            );
        }
    };

    locationPickupFailure = err => {
        if (err) {
            Alert.alert(
                GPS_ALERT,
                GPS_ALERT_MESSAGE,
                [
                    {
                        text: 'Exit',
                        onPress: () =>
                            this.setState({ isPickingLocation: false }, () =>
                                console.log('cancel')
                            ),
                        style: 'cancel',
                    },
                    {},
                    {
                        text: 'Retry',
                        onPress: () => this.pickLocation(),
                        style: 'ok',
                    },
                ],
                { cancelable: false }
            );
        }
    };

    locationPickupSuccess = position => {
        if (typeof position !== 'undefined' && position !== null) {
            let scheme = Platform.select({
                ios: 'maps:http://maps.apple.com/?q=',
                android: 'geo:http://maps.google.com/?q=',
            });
            let latLng = `${position.latitude},${position.longitude}`;
            let label = 'You here';
            let url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`,
            });
            this.setState(
                {
                    url: url,
                    isPickingLocation: false,
                },
                () =>
                    this.props.updateValue(this.props.attributes.name, {
                        lat: position.latitude,
                        long: position.longitude,
                    })
            );
        }
    };

    renderPostionUrl = attributes => {
        let url = null;
        if (
            !isEmpty(attributes.value) &&
            !isEmpty(attributes.value['lat']) &&
            !isEmpty(attributes.value['long'])
        ) {
            let scheme = Platform.select({
                ios: 'maps:http://maps.apple.com/?q=',
                android: 'geo:http://maps.google.com/?q=',
            });
            let latLng = `${attributes.value.lat},${attributes.value.long}`;
            let label = 'You here';
            url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`,
            });
        } else {
            url = this.state.url;
        }
        if (url) {
            return (
                <TouchableOpacity
                    style={styles.valueContainer}
                    onPress={() => {
                        Linking.canOpenURL(url)
                            .then(supported => {
                                if (supported) {
                                    return Linking.openURL(url);
                                }
                            })
                            .catch(err => {
                                console.error('An error occurred', err);
                            });
                    }}
                >
                    <Text style={styles.textStyle} numberOfLines={1}>
                        {url}
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={styles.valueContainer}>
                    <Text style={styles.textStyle} numberOfLines={1}>
                        {this.state.isPickingLocation ? 'Picking...' : ''}
                    </Text>
                </View>
            );
        }
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View style={styles.container}>
                <ListItem style={{ borderBottomWidth: 0, paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={styles.placeHolder}>
                            {attributes.label}
                        </Text>
                        {this.renderPostionUrl(attributes)}
                    </View>
                </ListItem>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
