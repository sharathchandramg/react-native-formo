import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Animated,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { View } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FastImage from "react-native-fast-image";
import SignatureScreen from "react-native-signature-canvas";
import _ from "lodash";

import styles from "./styles";
import { isEmpty } from "../../utils/validators";
import StarIcon from "../../components/starIcon";
import ZoomImage from "../../components/zoomImage";

const DEVICE_WIDTH = Dimensions.get("window").width;
const moment = require("moment");

// CSS injected into the signature canvas WebView.
//   .m-signature-pad--footer { display: none; }
//     Hides the library's built-in Save/Clear buttons since we render our own.
//   .m-signature-pad--body   { border: none; }
//     Removes the default canvas border (we draw our own outline below).
//   body, html { background-color: #fff; height: 100%; width: 100%; }
//     Ensures a white background — matches the original component's appearance.
const SIGNATURE_WEB_STYLE = `
  .m-signature-pad--footer { display: none; margin: 0px; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad { box-shadow: none; border: none; }
  body, html {
    width: 100%; height: 100%;
    background-color: #fff;
    margin: 0; padding: 0;
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
    this.signatureRef = React.createRef();
    this.state = {
      openImageModal: false,
      imgDetails: null,
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

  openImageModalView = (value) => {
    this.setState({
      imgDetails: value,
      openImageModal: true,
    });
  };

  renderImageItem = ({ item }) => {
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
          onPress={() => this.openImageModalView(item)}
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

  renderImageList = (images) => {
    if (!isEmpty(images)) {
      return (
        <View style={styles.hScrollView}>
          <FlatList
            horizontal={true}
            data={images}
            extraData={this.props}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderImageItem}
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

  /**
   * Trigger a signature read. The library is asynchronous — calling
   * readSignature() causes the WebView to capture the canvas and then fire
   * onOK (with base64) or onEmpty (no strokes drawn).
   *
   * CHANGED FROM ORIGINAL:
   *   Old: ref.current.saveImage()
   *   New: ref.current.readSignature()
   */
  saveSign = () => {
    if (this.signatureRef.current) {
      this.signatureRef.current.readSignature();
    }
  };

  /**
   * Clear the canvas.
   *
   * CHANGED FROM ORIGINAL:
   *   Old: ref.current.resetImage()
   *   New: ref.current.clearSignature()
   */
  resetSign = () => {
    if (this.signatureRef.current) {
      this.signatureRef.current.clearSignature();
    }
  };

  /**
   * Build a synthetic filename for the signature, since the new library does
   * not write a file to disk. Downstream code (handleDocumentUpdateAndDownload)
   * expects a file_path string, so we synthesize one matching the original
   * format: `signature_<utc-timestamp>.png`.
   *
   * CHANGED FROM ORIGINAL:
   *   The old version received a real on-disk path from the native library
   *   and rewrote its last segment. We don't have a real path, so we just
   *   generate the filename directly.
   */
  getSyntheticFilePath = () => {
    return `signature_${moment().utc().valueOf()}.png`;
  };

  /**
   * Called by react-native-signature-canvas when readSignature() captures a
   * non-empty signature.
   *
   * CHANGED FROM ORIGINAL `_onSaveEvent`:
   *   Old signature: result = { encoded: "base64...", pathName: "/abs/path.png" }
   *   New signature: signature = "data:image/png;base64,iVBORw0KGgo..."
   *
   *   We strip the data URL prefix to keep `base64_data` consistent with what
   *   downstream code used to receive (raw base64, no "data:image/png;base64,"
   *   prefix). If your backend / handleDocumentUpdateAndDownload actually
   *   expected the data URL prefix, remove the .replace() call below.
   */
  _onOK = (signature) => {
    const { attributes, handleDocumentUpdateAndDownload } = this.props;

    // Strip the data URL prefix → keep behavior consistent with the old
    // result["encoded"] which was raw base64.
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    this.setState(
      { signature: { encoded: base64Data }, viewMode: "portrait" },
      () => {
        this.closeImageModalView();
        this.isLocal = true;
      }
    );

    if (typeof handleDocumentUpdateAndDownload === "function") {
      handleDocumentUpdateAndDownload(
        attributes,
        [
          {
            mime_type: "image/png",
            file_path: this.getSyntheticFilePath(),
            base64_data: base64Data,
          },
        ],
        "write"
      );
    }
  };

  /**
   * Called when readSignature() is invoked but the canvas is empty.
   * We just no-op (don't close the modal so user can try again).
   */
  _onEmpty = () => {
    // Could optionally show a toast: "Please sign before saving"
  };

  getImguri = (item, isFromLocal = false) => {
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
        uri: this.getImguri(signatureObj, true),
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
        uri: this.getImguri(value[0]),
        priority: FastImage.priority.normal,
        headers: {
          "content-type": "image/png",
        },
      });
    }

    return (
      <View style={[styles.topContainer, { borderColor: "#a94442" }]}>
        <Animated.View style={{ flex: 1, flexDirection: "row" }}>
          {data && data.length ? this.renderImageList(data) : <View />}
        </Animated.View>
      </View>
    );
  };

  renderAddImageIcon = () => {
    return (
      <TouchableOpacity
        style={styles.valueContainer}
        onPress={() =>
          this.setState({
            openImageModal: true,
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

  checkImageData = () => {
    const value = this.props.attributes["value"] || "";
    if (!isEmpty(this.state.signature) || !isEmpty(value)) {
      return true;
    }
    return false;
  };

  closeImageModalView = () => {
    this.setState({
      imgDetails: null,
      openImageModal: false,
      viewMode: "portrait",
    });
  };

  renderModalContent = (item) => {
    const { AppNBText } = this.props;
    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={[styles.modalHeader, { backgroundColor: "black" }]}
          onPress={() => this.closeImageModalView()}
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
              closeModal={this.closeImageModalView}
              backgroundColor="white"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View
              style={{
                flex: 1,
                borderColor: "#000033",
                borderWidth: 1,
              }}
            >
              <SignatureScreen
                ref={this.signatureRef}
                onOK={this._onOK}
                onEmpty={this._onEmpty}
                webStyle={SIGNATURE_WEB_STYLE}
                // We render our own Save/Reset buttons below, so disable the
                // library's built-in footer entirely.
                autoClear={false}
                // Pen color & background — matches what react-native-signature-capture
                // rendered with by default.
                penColor="#000000"
                backgroundColor="#ffffff"
                // imageType "image/png" matches the old library's output format.
                imageType="image/png"
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.saveSign()}
              >
                <AppNBText size={16}>Save</AppNBText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.resetSign()}
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
          <View
            style={{
              height: 50,
              marginHorizontal: 15,
              paddingStart: 5,
            }}
          >
            <View
              style={{
                borderBottomColor: attributes["error"]
                  ? theme.errorMsgColor
                  : theme.inputBorderColor,
                borderBottomWidth: theme.borderWidth,
                flex: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
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
                    openImageModal: true,
                    viewMode: "portrait",
                  })
                }
              >
                {this.renderAddImageIcon()}
              </TouchableOpacity>
            </View>
          </View>
          {this.checkImageData() ? (
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

          {this.state.openImageModal && (
            <Modal
              visible={this.state.openImageModal}
              animationType={"fade"}
              transparent={true}
              onRequestClose={() => this.closeImageModalView()}
              // NOTE: onPressOut prop removed — not a valid Modal prop.
              // Dismissal happens via the Close button or Android back button.
              // NOTE: changed `isVisible` (wrong prop name) → `visible`.
              // `isVisible` was being silently ignored by RN's Modal; the
              // modal was rendering only because of the parent conditional.
              // This is a latent bug fix.
            >
              {this.renderModalContent(this.state.imgDetails)}
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