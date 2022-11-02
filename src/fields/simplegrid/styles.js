import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  inputLabelWrapper: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 10,
    borderColor: "#41E1FD",
    borderWidth: 2,
    borderRadius: 4,
  },
  inputLabel: {
    width: "100%",
    flexDirection: "column",
    paddingStart: 5,
  },
  labelTextWrapper: {
    flexDirection: "row",
  },
  valueWrapper: {
    flexDirection: "row",
    paddingTop: 10,
  },
  labelText: {
    fontSize: 16,
    color: "#ADADAD",
    fontFamily: "roboto",
    textAlign: "left",
    fontWeight: "300",
    paddingStart: 5,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#575757",
    fontFamily: "roboto",
    alignSelf: "center",
    fontWeight: "100",
  },
});

export default styles;
