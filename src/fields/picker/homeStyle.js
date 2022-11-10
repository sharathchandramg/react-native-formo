import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "#000",
    fontStyle: "normal",
  },
  picker: {
    width: Dimensions.get("window").width * 0.8,
    height: 40,
    padding: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  icon: {
    fontSize: 15,
    color: "#000",
  },
});
