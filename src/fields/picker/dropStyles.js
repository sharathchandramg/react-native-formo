import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#00000080",
    flexDirection: "column",
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    width: Dimensions.get("window").width * 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    backgroundColor: "white",
    width: "100%",
  },
  textInput: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#1F618D",
    width: Dimensions.get("window").width * 0.8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
