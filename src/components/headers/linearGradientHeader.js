import React from "react";
import { View } from "native-base";
import LinearGradient from "react-native-linear-gradient";

const LinearGradientHeader = () => {
  return (
    <LinearGradient
      colors={["#03F299", "#0089F8"]}
      style={{
        height: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        elevation: 2,
        opacity: 1,
        backgroundColor: "transparent",
      }}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
      locations={[0.8, 1]}
    >
      <View
        style={{
          height: 1,
          alignSelf: "stretch",
          flexDirection: "row",
          elevation: 2,
          opacity: 1,
          backgroundColor: "transparent",
        }}
      />
    </LinearGradient>
  );
};

export default LinearGradientHeader;
