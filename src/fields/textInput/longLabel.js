import React, { useState } from "react";
import { Text, Pressable } from "react-native";
import { View } from "native-base";
import { isNull } from "../../../../../src/utils/helper";
import StarIcon from "../../components/starIcon";

const LongLabel = (props) => {
  const NUM_LINES = 1;

  const [hasMore, setHasMore] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [numOfLines, setNumOfLines] = useState(NUM_LINES);
  const readMoreText = showMore ? "Show Less" : "Read More...";

  const onLoadMoreToggle = () => {
    setShowMore(!showMore);
  };

  const onTextLayout = (e) => {
    setHasMore(e.nativeEvent.lines.length > NUM_LINES);
    setNumOfLines(e.nativeEvent.lines.length);
    props.handleChangeNoOfLines(e.nativeEvent.lines.length);
  };

  if (isNull(props.text)) {
    return null;
  }

  return (
    <Pressable onPress={() => onLoadMoreToggle()} style={{ paddingTop: 5 }}>
      <Text
        onTextLayout={onTextLayout}
        style={{
          opacity: 0,
          position: "absolute",
          fontSize: 16,
          paddingStart: 5,
          color: props.theme.inputColorPlaceholder,
          lineHeight: 18,
        }}
      >
        {props.text}
      </Text>
      <Text
        style={{
          fontSize: 16,
          paddingStart: 5,
          color: props.theme.inputColorPlaceholder,
          lineHeight: 18,
        }}
        numberOfLines={!hasMore ? NUM_LINES : showMore ? numOfLines : NUM_LINES}
      >
        {props.attributes["required"] && (
          <StarIcon required={props.attributes["required"]} />
        )}{" "}
        {props.text}
      </Text>
      {/* {hasMore && (
        <View>
          <Text
            style={{
              fontSize: 14,
              paddingStart: 5,
              color: "#41E1FD",
            }}
          >
            {readMoreText}
          </Text>
        </View>
      )} */}
    </Pressable>
  );
};

export default LongLabel;
