import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  ActionSheetIOS,
  Animated,
  Platform,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TouchableHighlight,
  Alert,
  Modal,
  PermissionsAndroid,
} from "react-native";
import { View } from "native-base";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import BottomSheet from "react-native-js-bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome";
import FastImage from "react-native-fast-image";
import _ from "lodash";

import styles from "./styles";
import { isEmpty } from "../../utils/validators";
import StarIcon from "../../components/starIcon";
import ZoomImage from "./../../components/zoomImage";

const DEVICE_WIDTH = Dimensions.get("window").width;
const options = ["Open camera", "Select from the gallery", "Cancel"];

export default class ImageField extends Component {
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
    this.state = {
      imageArray: undefined,
      height: new Animated.Value(0),
      stepIndex: 0,
      openImageModal: false,
      imgDetails: null,
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

  _startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.height, {
        toValue: 0,
        duration: 250,
      }),
      Animated.timing(this.state.height, {
        toValue: 150,
        duration: 500,
        delay: 75,
      }),
    ]).start();
  };

  _getImageFromStorage = (images, usedCamera = false) => {
    const { attributes, updateValue, handleDocumentUpdateAndDownload } =
      this.props;
    let imageArray = [];
    let filePath = "";
    const { multiple, maxFiles } = this.getImageConfiguration();

    if (typeof multiple !== "undefined" && multiple) {
      const mImages = usedCamera ? [images] : images;
      _.forEach(mImages, (image, index) => {
        if (index < maxFiles) {
          filePath = Platform.OS.match(/ios/i)
            ? image["path"].replace("file://", "", 1)
            : image["path"];
          imageArray.push({
            mime_type: image["mime"],
            file_path: filePath,
            base64_data: image["data"],
          });
        }
      });
    } else {
      filePath = Platform.OS.match(/ios/i)
        ? images["path"].replace("file://", "", 1)
        : images["path"];
      imageArray.push({
        mime_type: images["mime"],
        file_path: filePath,
        base64_data: images["data"],
      });
    }

    this.setState(
      {
        imageArray: imageArray,
      },
      () => {
        if (Platform.OS !== "ios") this.bottomSheet.close();
        this._startAnimation();
        this.isLocal = true;
        updateValue(attributes.name, imageArray);
      }
    );

    if (typeof handleDocumentUpdateAndDownload === "function") {
      handleDocumentUpdateAndDownload(attributes, imageArray, "write");
    }
  };

  _nextScrollIndex = () => {
    const { stepIndex, imageArray } = this.state;
    const { attributes } = this.props;
    let currentFlatlistIndex = stepIndex;
    const len =
      !isEmpty(imageArray) && Array.isArray(imageArray)
        ? imageArray.length
        : !isEmpty(attributes["value"]) && Array.isArray(attributes["value"])
        ? attributes["value"].length
        : 0;
    if (currentFlatlistIndex < len - 1) {
      currentFlatlistIndex = currentFlatlistIndex + 1;
      this.flatListRef.scrollToIndex({
        index: currentFlatlistIndex,
        animated: true,
      });
      this.setState({ stepIndex: currentFlatlistIndex });
    } else {
      currentFlatlistIndex = 0;
      this.flatListRef.scrollToIndex({
        index: currentFlatlistIndex,
        animated: true,
      });
      this.setState({ stepIndex: currentFlatlistIndex });
    }
  };

  getImageConfiguration = () => {
    const { additional_config } = this.props.attributes;
    let mode = "low-resolution";
    let multiple = false;
    let config = null;
    let maxFiles = 1;

    if (!isEmpty(additional_config)) {
      mode = additional_config["mode"] || "low-resolution";
      multiple = additional_config["multiple"] || false;
      maxFiles = multiple ? additional_config["max_files"] || 5 : 1;
    }
    if (!isEmpty(mode) && mode.match(/high-resolution/i)) {
      config = {
        compressImageMaxWidth: 1080,
        compressImageMaxHeight: 1080,
        includeBase64: true,
        multiple: multiple,
        maxFiles: multiple ? maxFiles : 1,
        mediaType: "photo",
        showsSelectedCount: true,
        compressImageQuality: 0.6,
      };
    } else {
      config = {
        compressImageMaxWidth: 360,
        compressImageMaxHeight: 360,
        includeBase64: true,
        multiple: multiple,
        maxFiles: multiple ? maxFiles : 1,
        mediaType: "photo",
        showsSelectedCount: true,
        compressImageQuality: 1,
      };
    }

    return config;
  };

  renderAlert = (title, message, onOk = null) => {
    Alert.alert(
      title || "",
      message || "",
      [
        {
          text: "Cancel",
          onPress: () => {
            if (Platform.OS !== "ios") this.bottomSheet?.close();
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            if (typeof onOk === "function") {
              onOk();
            }
            if (Platform.OS !== "ios") this.bottomSheet?.close();
          },
        },
      ],
      { cancelable: false }
    );
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "Allow app to use your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  _openCamera = async () => {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      this.renderAlert(
        "",
        "Camera permission is required to take photos.",
        () => {
          if (Platform.OS !== "ios") this.bottomSheet?.close();
        }
      );
      return;
    }
    const config = this.getImageConfiguration();
    launchCamera(
      {
        mediaType: config.mediaType || "photo",
        includeBase64: config.includeBase64 ?? true,
        maxWidth: config.compressImageMaxWidth,
        maxHeight: config.compressImageMaxHeight,
        quality: config.compressImageQuality,
        cameraType: "back",
        saveToPhotos: false, // required to avoid WRITE permissions
      },
      (res) => {
        if (res.didCancel || res.errorCode) {
          if (Platform.OS !== "ios") this.bottomSheet.close();
          return;
        }

        const img = res.assets?.[0];
        if (!img) {
          if (Platform.OS !== "ios") this.bottomSheet.close();
          return;
        }

        // Normalize to your expected structure
        const normalized = {
          path: img.uri,
          mime: img.type,
          data: img.base64,
        };

        // Camera always returns ONE image
        this._getImageFromStorage(normalized, true);

        if (Platform.OS !== "ios") this.bottomSheet.close();
      }
    );
  };

  _openPicker = () => {
    const config = this.getImageConfiguration();

    launchImageLibrary(
      {
        mediaType: config.mediaType || "photo",
        includeBase64: config.includeBase64 ?? true,
        selectionLimit: config.multiple ? config.maxFiles : 1,
        maxWidth: config.compressImageMaxWidth,
        maxHeight: config.compressImageMaxHeight,
        quality: config.compressImageQuality,
      },
      (res) => {
        if (res.didCancel || res.errorCode) {
          if (Platform.OS !== "ios") this.bottomSheet.close();
          return;
        }

        const assets = res.assets || [];

        // Normalize all images
        const normalizedImages = assets.map((img) => ({
          path: img.uri,
          mime: img.type,
          data: img.base64,
        }));

        if (config.multiple) {
          // MULTIPLE CASE
          if (normalizedImages.length > config.maxFiles) {
            this.renderAlert(
              "",
              `Alert!! Only the first ${config.maxFiles} files will be uploaded.`,
              () => {
                this._getImageFromStorage(
                  normalizedImages.slice(0, config.maxFiles),
                  false
                );
              }
            );
          } else {
            this._getImageFromStorage(normalizedImages, false);
          }
        } else {
          // SINGLE IMAGE CASE
          const single = normalizedImages[0];

          if (single) {
            this._getImageFromStorage(single, false);
          }
        }

        if (Platform.OS !== "ios") this.bottomSheet.close();
      }
    );
  };

  _renderOptions = () => {
    const { additional_config } = this.props.attributes;
    let galleryOption = [
      {
        title: options[0],
        onPress: () => this._openCamera(),
        icon: (
          <Icon name="camera" size={24} type={"regular"} color={"#828282"} />
        ),
      },
      {
        title: options[1],
        onPress: () => this._openPicker(),
        icon: (
          <Icon name="image" size={24} type={"regular"} color={"#828282"} />
        ),
      },
    ];

    if (!isEmpty(additional_config) && additional_config.hide_gallery) {
      galleryOption = [
        {
          title: options[0],
          onPress: () => this._openCamera(),
          icon: (
            <Icon name="camera" size={24} type={"regular"} color={"#828282"} />
          ),
        },
      ];
    }

    return [...galleryOption];
  };

  _onPressImage = () => {
    const { additional_config } = this.props.attributes;
    let options1 = ["Cancel", "Open camera", "Select from the gallery"];
    if (!isEmpty(additional_config) && additional_config.hide_gallery) {
      options1 = ["Cancel", "Open camera"];
    }
    ActionSheetIOS.showActionSheetWithOptions(
      { options: options1, cancelButtonIndex: 0 },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          // Correct: call existing method
          this._openCamera();
        } else if (buttonIndex === 2) {
          // Correct: call existing method
          this._openPicker();
        }
      }
    );
  };

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
          {images.length > 1 && (
            <View style={styles.moreIconContainer}>
              <TouchableHighlight
                style={styles.moreIconOuter}
                onPress={() => this._nextScrollIndex()}
                activeOpacity={0.0}
                underlayColor={"white"}
              >
                <View style={styles.moreIconInner}>
                  <Icon
                    name={"arrow-right"}
                    type="regular"
                    size={18}
                    color={"#0097eb"}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  getImguri = (item) => {
    if (!isEmpty(item["base64Data"]))
      return `data:${item["mime_type"]};base64,${item["base64Data"]}`;
    else return item["url"];
  };

  renderPreview = (attributes) => {
    const value = attributes.value;
    const imageArray = this.state.imageArray;

    let data = [];
    if (!isEmpty(imageArray) && _.some(imageArray, "file_path")) {
      _.forEach(imageArray, (image) => {
        data.push({
          uri: image["file_path"],
          priority: FastImage.priority.normal,
        });
      });
    } else if (
      !isEmpty(value) &&
      (_.some(value, "url") || _.some(value, "base64Data"))
    ) {
      _.forEach(value, (image) => {
        data.push({
          uri: this.getImguri(image),
          priority: FastImage.priority.normal,
          headers: {
            "content-type": image["contentType"] || image["mime_type"],
          },
        });
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
        onPress={
          Platform.OS === "ios"
            ? this._onPressImage
            : () => this.bottomSheet.open()
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
    const imageArray = this.state.imageArray;
    const value = this.props.attributes["value"] || "";
    if (!isEmpty(imageArray) || !isEmpty(value)) {
      return true;
    }
    return false;
  };

  closeImageModalView = () => {
    this.setState({
      imgDetails: null,
      openImageModal: false,
    });
  };

  renderModalContent = (item) => {
    const { AppNBText } = this.props;
    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.modalHeader}
          onPress={() => this.closeImageModalView()}
        >
          <AppNBText
            size={12}
            style={styles.modalHeaderTitle}
          >{`Close`}</AppNBText>
        </TouchableOpacity>
        <View style={styles.imageWrapper}>
          <ZoomImage
            item={item}
            closeModal={this.closeImageModalView}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
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
              paddingHorizontal: 15,
              height: 50,
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
                paddingStart: 5,
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
                onPress={
                  Platform.OS === "ios"
                    ? this._onPressImage
                    : () => this.bottomSheet.open()
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
                marginTop: 10,
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
              onPressOut={() => this.closeImageModalView()}
            >
              {this.state.imgDetails
                ? this.renderModalContent(this.state.imgDetails)
                : null}
            </Modal>
          )}
          {Platform.OS === "android" ? (
            <BottomSheet
              ref={(ref) => {
                this.bottomSheet = ref;
              }}
              title={"Choose image from"}
              options={this._renderOptions()}
              coverScreen={true}
              titleFontFamily={styles.titleFontFamily}
              styleContainer={styles.styleContainer}
              fontFamily={styles.fontFamily}
            />
          ) : null}
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}
