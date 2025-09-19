import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Animated,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { View } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FastImage from "react-native-fast-image";
import _ from "lodash";

import styles from "./styles";
import { isEmpty } from "../../utils/validators";
import StarIcon from "../../components/starIcon";
import ZoomImage from "../../components/zoomImage";
import SignatureCanvas from "react-native-signature-canvas";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const moment = require("moment");
const webStyle = `
  .m-signature-pad {
    box-shadow: none;
    border: none;
    position: absolute;
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0;
    height: 100% !important;
    width: 100% !important;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
  .m-signature-pad--body {
    border: none;
  }
  .m-signature-pad--footer {
    display: none;
  }
`;

export default class SignatureField extends Component {
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
    this.myRef = React.createRef();
    this.state = {
      openSignatureModal: false,
      signatureDetails: null,
      viewMode: "portrait",
      signature: null,
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
        typeof handleDocumentUpdateAndDownload === "function" &&
        !isEmpty(value)
      ) {
        handleDocumentUpdateAndDownload(
          attributes,
          value,
          "read",
          this.isFirstTime
        );
        this.isFirstTime = false;
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  openSignatureModalView = (value) => {
    this.setState({
      signatureDetails: value,
      openSignatureModal: true,
    });
  };

  renderSignatureItem = ({ item }) => {
    return (
      <View
        style={{
          height: 150,
          width: parseInt(DEVICE_WIDTH - 20),
          paddingEnd: 5,
        }}
        key={item["uri"]}
      >
        <TouchableOpacity
          style={{
            height: 150,
            width: parseInt(DEVICE_WIDTH - 20),
            paddingEnd: 5,
          }}
          onPress={() => this.openSignatureModalView(item)}
        >
          <FastImage
            style={{ flex: 1 }}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: item["uri"],
              headers: item["headers"] || {},
              priority: item["priority"],
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderSignatureList = (signatures) => {
    if (!isEmpty(signatures)) {
      return (
        <View style={styles.hScrollView}>
          <FlatList
            horizontal={true}
            data={signatures}
            extraData={this.props}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderSignatureItem}
            nestedScrollEnabled={true}
            ref={(ref) => {
              this.flatListRef = ref;
            }}
          />
        </View>
      );
    }
    return null;
  };

  getUpdatedPath = (filePath) => {
    const splitPath = filePath ? filePath.split("/") : [];
    if (splitPath.length > 0) {
      splitPath[splitPath.length - 1] = `signature_${moment()
        .utc()
        .valueOf()}.png`;
    }
    return splitPath.join("/");
  };

  getSignatureuri = (item, isFromLocal = false) => {
    if (isFromLocal) {
      return `data:image/png;base64,${item["encoded"]}`;
    } else if (!isEmpty(item["base64Data"]))
      return `data:image/png;base64,${item["base64Data"]}`;
    else return item["url"];
  };

  renderPreview = (attributes) => {
    const value = attributes.value;
    const signatureObj = this.state.signature;

    let data = [];
    if (!isEmpty(signatureObj)) {
      data.push({
        uri: this.getSignatureuri(signatureObj, true),
        priority: FastImage.priority.normal,
        headers: {
          "content-type": "image/png",
        },
      });
    } else if (
      !isEmpty(value) &&
      (_.some(value, "url") || _.some(value, "base64Data"))
    ) {
      data.push({
        uri: this.getSignatureuri(value[0]),
        priority: FastImage.priority.normal,
        headers: {
          "content-type": "image/png",
        },
      });
    }

    return (
      <View style={[styles.topContainer, { borderColor: "#a94442" }]}>
        <Animated.View style={{ flex: 1, flexDirection: "row" }}>
          {data && data.length ? this.renderSignatureList(data) : <View />}
        </Animated.View>
      </View>
    );
  };

  renderAddSignatureIcon = () => {
    return (
      <TouchableOpacity
        style={styles.valueContainer}
        onPress={() =>
          this.setState({
            openSignatureModal: true,
            viewMode: "portrait",
          })
        }
      >
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

  checkSignatureData = () => {
    const value = this.props.attributes["value"] || "";
    if (!isEmpty(this.state.signature) || !isEmpty(value)) {
      return true;
    }
    return false;
  };

  closeSignatureModalView = () => {
    this.setState({
      signatureDetails: null,
      openSignatureModal: false,
      viewMode: "portrait",
    });
  };

  handleSignatureOK = (signatureDataURL) => {
    const base64 = signatureDataURL.replace("data:image/png;base64,", "");
    if (typeof this.props.handleDocumentUpdateAndDownload === "function") {
      this.props.handleDocumentUpdateAndDownload(
        this.props.attributes,
        [
          {
            mime_type: "image/png",
            file_path: `signature_${Date.now()}.png`,
            base64_data: base64,
          },
        ],
        "write"
      );
    }
    this.setState({
      signature: { encoded: base64 },
      openSignatureModal: false,
    });
    this.isLocal = true;
  };

  resetSignature = () => {
    this.myRef.current.clearSignature();
  };

  saveSignature = () => {
    this.myRef.current.readSignature();
  };

  renderModalContent = (item) => {
    const { AppNBText, theme } = this.props;
    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={[styles.modalHeader, { backgroundColor: "black" }]}
          onPress={() => this.closeSignatureModalView()}
        >
          <AppNBText
            size={12}
            style={styles.modalHeaderTitle}
          >{`Close`}</AppNBText>
        </TouchableOpacity>
        {item ? (
          <View style={styles.imageWrapper}>
            <ZoomImage
              item={item}
              closeModal={this.closeSignatureModalView}
              backgroundColor="white"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: "column", height: "100%" }}>
            <SignatureCanvas
              ref={this.myRef}
              onOK={this.handleSignatureOK}
              // onEnd can be used if you want to auto-save when drawing stops
              style={{
                flex: 1,
                borderColor: "#000033",
                borderWidth: 1,
                width: DEVICE_WIDTH,
                height: DEVICE_HEIGHT,
              }}
              penColor="#000033"
              backgroundColor={theme.header.backgroundColor}
              trimWhitespace={true}
              webStyle={webStyle}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.saveSignature}
              >
                <AppNBText size={16}>Save</AppNBText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={this.resetSignature}
              >
                <AppNBText size={16}>Reset</AppNBText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, AppNBText, AppRNText } =
      this.props;
    return (
      <View>
        <View>
          <View style={styles.topOuterContainer}>
            <View
              style={[
                styles.topInnerContainer,
                {
                  borderBottomColor: attributes["error"]
                    ? theme.errorMsgColor
                    : theme.inputBorderColor,
                },
              ]}
            >
              {attributes["required"] && (
                <StarIcon
                  required={attributes["required"]}
                  AppNBText={AppNBText}
                />
              )}
              <AppNBText
                size={16}
                style={{
                  flex: 1,
                  color: theme.inputColorPlaceholder,
                  paddingStart: 5,
                  //   fontSize: 16,
                }}
              >
                {attributes.label}
              </AppNBText>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
                onPress={() =>
                  this.setState({
                    openSignatureModal: true,
                    viewMode: "portrait",
                  })
                }
              >
                {this.renderAddSignatureIcon()}
              </TouchableOpacity>
            </View>
          </View>
          {this.checkSignatureData() ? (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                paddingTop: 10,
              }}
            >
              {this.renderPreview(attributes)}
            </View>
          ) : null}

          {this.state.openSignatureModal && (
            <Modal
              isVisible={this.state.openSignatureModal}
              animationType={"fade"}
              transparent={true}
              onRequestClose={() => this.closeImageModalView()}
              onPressOut={() => this.closeImageModalView()}
            >
              {this.renderModalContent(this.state.signatureDetails)}
            </Modal>
          )}
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}
