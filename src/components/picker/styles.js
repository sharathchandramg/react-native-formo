import { StyleSheet, Dimensions } from "react-native";
const width = Dimensions.get("window").width;

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
    width: width * 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    backgroundColor: "white",
    width: "100%",
    position: "relative",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  noResultsWrapper: {
    backgroundColor: "#fff",
    width: "100%",
    height: 60,
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    textAlign: "center",
    // fontSize: 16,
  },
  inputText: {
    paddingRight: 25,
    // fontSize: 16,
  },
  itemWrapper1: {
    width: width * 0.8,
    backgroundColor: "white",
  },
  itemWrapper2: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemText: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    // fontSize: 16,
  },
  searchIconWrapper: {
    position: "absolute",
    right: 20,
  },
});

export default styles;
