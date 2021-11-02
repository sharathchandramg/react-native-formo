import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity, Alert, Modal } from "react-native";
import { View, ListItem, Text, Item } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { RNCamera } from "react-native-camera";
import _ from "lodash";

import { isEmpty } from "./../../utils/validators";
import StarIcon from "../../components/starIcon";
import styles from "./styles";

export default class BarcodeField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    theme: PropTypes.object,
    updateValue: PropTypes.func,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  renderAddImageIcon = () => {
    const { attributes, theme } = this.props;
    return (
      <TouchableOpacity
        style={styles.valueContainer}
        onPress={() => this.setState({ openModal: true })}
      >
        {!isEmpty(attributes) && !isEmpty(attributes.value) && (
          <Text
            style={{
              color: theme.inputColorPlaceholder,
              paddingEnd: 15,
            }}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {attributes.value}
          </Text>
        )}
        <Icon
          name="image"
          size={24}
          type={"regular"}
          color={"#828282"}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    );
  };

  onBarCodeRead = (code) => {
    this.props.updateValue(this.props.attributes.name, code.data);
    this.setState({ openModal: false });
  };

  renderModalContent = () => {
    return (
      <View style={styles.modalContainer}>
        <RNCamera
          style={styles.modalPreview}
          flashMode={RNCamera.Constants.FlashMode.on}
          onBarCodeRead={this.onBarCodeRead}
          ref={(cam) => (this.camera = cam)}
        />
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
            <View style={{ flexDirection: "row", flex: 2 }}>
              <Item
                error={
                  theme.changeTextInputColorOnError ? attributes.error : null
                }
                style={{ paddingVertical: 10 }}
              >
                {attributes["required"] && (
                  <StarIcon required={attributes["required"]} />
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
                    flexDirection: "row",
                    flex: 1,
                  }}
                  onPress={() => this.setState({ openModal: true })}
                >
                  {this.renderAddImageIcon()}
                </TouchableOpacity>
              </Item>
            </View>
          </ListItem>
          {this.state.openModal && (
            <Modal
              isVisible={this.state.openModal}
              animationType={"fade"}
              transparent={true}
              onRequestClose={() => this.setState({ openModal: false })}
              onPressOut={() => this.setState({ openModal: false })}
            >
              {this.renderModalContent()}
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
