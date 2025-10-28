import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, Alert, TouchableOpacity } from "react-native";
import { View } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import { promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";

import {
  getGeoLocation,
  requestLocationPermission,
} from "./../../utils/helper";
import styles from "./styles";
import { isEmpty } from "../../utils/validators";
import StarIcon from "../../components/starIcon";

const moment = require("moment");

const TIME_ALERT = "Accurate Time Fetch Error";
const TIME_LOADING = "Fetching accurate time...";
const LOCATION_ALERT = "This action requires GPS location";

export default class TimeField extends Component {
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
      isFetchingTime: false,
      isFirstTime: true,
      currentTime: null,
      timeZone: null,
      latLng: null,
    };
  }

  componentDidMount() {
    this.setState({ isFirstTime: true });
  }

  componentDidUpdate() {
    try {
      if (
        this.state.isFirstTime &&
        this.props.attributes &&
        !this.props.attributes["is_lookup_field"]
      ) {
        if (!isEmpty(this.props.formData)) {
          const { value } = this.props.attributes;
          if (isEmpty(value)) {
            this.setState({
              isFetchingTime: true,
              isFirstTime: false,
            });
            this.promptForEnableLocation();
          } else {
            this.setState({
              isFetchingTime: false,
              isFirstTime: false,
            });
          }
        } else {
          this.setState({ isFetchingTime: true, isFirstTime: false });
          this.promptForEnableLocation();
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }

  /**
   * Ask Android/iOS to enable location if off, then get time.
   */
  promptForEnableLocation = async () => {
    if (Platform.OS === "android") {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        this.fetchAccurateTime();
      } catch (error) {
        const { attributes, navigation } = this.props;
        if (attributes["required"] && typeof navigation !== "undefined") {
          Alert.alert(
            LOCATION_ALERT,
            "Turn on location services from Settings"
          );
          navigation.goBack(null);
        } else if (!attributes["required"]) {
          this.fetchAccurateTime();
        } else {
          this.setState({ isFetchingTime: false });
        }
      }
    } else {
      this.fetchAccurateTime();
    }
  };

  /**
   * Get accurate real-world time based on GPS coordinates.
   */
  fetchAccurateTime = () => {
    if (Platform.OS === "android") {
      requestLocationPermission()
        .then((response) => {
          if (response.permission) {
            getGeoLocation(
              { highAccuracy: true, timeout: 10000 },
              (coords, err) => {
                if (err) {
                  this.handleTimeFailure(err);
                  this.props.notifyLocationError &&
                    this.props.notifyLocationError(err);
                } else {
                  this.fetchTimeFromAPI(coords);
                }
              }
            );
          } else {
            this.handleTimeFailure(response.err);
          }
        })
        .catch((response) => this.handleTimeFailure(response.err));
    } else {
      getGeoLocation({ highAccuracy: true, timeout: 10000 }, (coords, err) => {
        if (err) {
          const { attributes, navigation } = this.props;
          if (attributes["required"] && typeof navigation !== "undefined") {
            Alert.alert(LOCATION_ALERT, "Enable location in settings");
            navigation.goBack(null);
          } else {
            this.handleTimeFailure(err);
            this.props.notifyLocationError &&
              this.props.notifyLocationError(err);
          }
        } else {
          this.fetchTimeFromAPI(coords);
        }
      });
    }
  };

  /**
   * Calls timeapi.io to fetch NTP-synced real-world time.
   */
  fetchTimeFromAPI = async (coords) => {
    try {
      const { latitude, longitude } = coords;
      const url = `https://timeapi.io/api/Time/current/coordinate?latitude=${latitude}&longitude=${longitude}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.dateTime) {
        this.setState(
          {
            currentTime: data.dateTime,
            timeZone: data.timeZone,
            latLng: `${latitude},${longitude}`,
            isFetchingTime: false,
          },
          () => {
            this.props.updateValue(this.props.attributes.name, {
              time: data.dateTime,
              timeZone: data.timeZone,
              lat: latitude,
              long: longitude,
            });
          }
        );
      } else {
        this.handleTimeFailure("Invalid time data");
      }
    } catch (err) {
      this.handleTimeFailure(err);
    }
  };

  handleTimeFailure = (err) => {
    Alert.alert(
      TIME_ALERT,
      "Failed to get accurate time. Check your network or GPS.",
      [
        {
          text: "Retry",
          onPress: () => this.promptForEnableLocation(),
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => this.setState({ isFetchingTime: false }),
        },
      ],
      { cancelable: false }
    );
  };

  renderTimeDisplay = (attributes) => {
    const { AppNBText } = this.props;
    const { isFetchingTime, currentTime, timeZone } = this.state;
    let displayText = "";

    if (!isEmpty(attributes.value) && attributes.value.time) {
      // displayText = `${attributes.value.time} (${attributes.value.timeZone})`;
      displayText = `${attributes.value.time}`;
    } else if (currentTime) {
      // displayText = `${currentTime} (${timeZone})`;
      displayText = `${currentTime}`;
    }

    const formattedTime = displayText
      ? moment(displayText).format("HH:mm")
      : "";

    return (
      <TouchableOpacity
        style={styles.valueContainer}
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <AppNBText size={16} style={styles.textStyle} numberOfLines={1}>
          {isFetchingTime ? TIME_LOADING : formattedTime}
        </AppNBText>
      </TouchableOpacity>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, AppNBText, AppRNText } =
      this.props;
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 0,
            paddingHorizontal: 15,
            height: 50,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                borderBottomColor: attributes["error"]
                  ? theme.errorMsgColor
                  : theme.inputBorderColor,
                borderBottomWidth: theme.borderWidth,
                flexDirection: "row",
                height: 50,
                alignItems: "center",
                paddingStart: 5,
              }}
            >
              {attributes["required"] && (
                <StarIcon
                  required={attributes["required"]}
                  AppNBText={AppNBText}
                />
              )}

              <AppNBText size={16} style={styles.placeHolder}>
                {attributes.label}
              </AppNBText>

              {this.renderTimeDisplay(attributes)}

              {!this.props.attributes["is_lookup_field"] && (
                <Icon
                  name="sync"
                  size={16}
                  color={"#828282"}
                  style={{ marginRight: 10 }}
                  onPress={() =>
                    this.setState(
                      { isFetchingTime: true, currentTime: null },
                      () => this.promptForEnableLocation()
                    )
                  }
                />
              )}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}
