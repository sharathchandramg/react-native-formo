import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { View, Text, ArrowForwardIcon } from "native-base";

import StarIcon from "../../components/starIcon";
const moment = require("moment");

export default class DateField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    timeZoneOffsetInHours: PropTypes.number,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);

    this.state = {
      modalVisible: false,
    };
  }

  onDateChange(date) {
    const epoch = moment(date).utc().valueOf();
    this.props.updateValue(this.props.attributes.name, epoch);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  dateFormatter = (date) => {
    switch (date) {
      case "today":
        return new Date();
      case "tomorrow":
        return new Date(moment().add(1, "days"));
      case "yesterday":
        return new Date(moment().subtract(1, "days"));
      default:
        if (!isNaN(date)) {
          return new Date(parseInt(date) * 1000);
        } else {
          return new Date();
        }
    }
  };

  renderDatePicker = () => {
    const { theme, attributes } = this.props;
    const value = (attributes.value && moment(attributes.value)) || null;
    let dateValue = "Select";

    switch (attributes.mode) {
      case "datetime":
        const datetimeFormat = attributes["is_24hour"]
          ? "Do MMM YYYY HH:mm"
          : "Do MMM YYYY hh:mm a";
        dateValue = value && moment(value).format(datetimeFormat);
        break;
      case "date":
        dateValue = value && moment(value).format("Do MMM YYYY");
        break;
      case "time":
        const timeFormat = attributes["is_24hour"] ? "HH:mm" : "hh:mm a";
        dateValue = value && moment(value).format(timeFormat);
        break;
      default:
        dateValue = value && moment(value).format("Do MMM YYYY HH:mm");
        break;
    }

    return (
      <View
        style={{
          borderBottomColor: attributes["error"]
            ? theme.errorMsgColor
            : theme.inputBorderColor,
          borderBottomWidth: theme.borderWidth,
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
          paddingStart: 5,
        }}
      >
        {attributes["required"] && (
          <StarIcon required={attributes["required"]} />
        )}
        <Text
          style={{
            flex: 1,
            color: theme.inputColorPlaceholder,
            paddingStart: 5,
            fontSize: 16,
          }}
          onPress={() => this.setModalVisible(true)}
        >
          {attributes.label}
        </Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
          style={{
            marginHorizontal: 5,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={{ paddingEnd: 10 }}>{dateValue}</Text>
          <ArrowForwardIcon size={"6"} color={theme.inputColorPlaceholder} />
        </TouchableOpacity>
      </View>
    );
  };

  renderDatePickerModal = (attributes) => {
    const currentDate = attributes.value
      ? new Date(attributes.value)
      : new Date();
    return (
      <DateTimePickerModal
        isVisible={this.state.modalVisible}
        date={currentDate}
        mode={attributes.mode}
        minimumDate={
          attributes.minDate && this.dateFormatter(attributes.minDate)
        }
        maximumDate={
          attributes.maxDate && this.dateFormatter(attributes.maxDate)
        }
        is24Hour={attributes["is_24hour"] ? true : false}
        onConfirm={(selectedDate) => {
          this.onDateChange(selectedDate);
          this.setModalVisible(false);
        }}
        onCancel={() => this.setModalVisible(false)}
        locale={attributes["is_24hour"] && "en_GB"}
      />
    );
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    return (
      <View>
        <View
          style={{
            height: 50,
            paddingHorizontal: 15,
          }}
        >
          {this.renderDatePicker()}
        </View>
        {this.renderDatePickerModal(attributes)}
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
      </View>
    );
  }
}
