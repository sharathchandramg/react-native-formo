import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#00000080",
    flexDirection: "column",
  },
  modalView: {
    // backgroundColor: "#FFFFFF",
    width: Dimensions.get("window").width * 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    backgroundColor: "white",
    width: "100%",
  },
});

export default styles;
