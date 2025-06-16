import React from "react";
import FastImage from "react-native-fast-image";
import { View, Dimensions } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const ImageView = (props) => {
  const item = props.item;
  return (
    <View style={props.style}>
      <ImageViewer
        imageUrls={[
          {
            url: "",
            width: deviceWidth,
            height: deviceHeight,
          },
        ]}
        renderImage={(props1) => {
          return (
            <FastImage
              style={[
                props1.style,
                {
                  backgroundColor: props.backgroundColor
                    ? props.backgroundColor
                    : "inherit",
                },
              ]}
              source={{
                uri: item["uri"],
                headers: item["headers"] || {},
                priority: item["priority"],
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          );
        }}
        renderIndicator={() => <View />}
        renderHeader={() => <View />}
        renderFooter={() => <View />}
      />
    </View>
  );
};

export default ImageView;
