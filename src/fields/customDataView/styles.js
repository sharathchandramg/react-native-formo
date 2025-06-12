import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 10,
  },
  inputLabelWrapper: {
    height: 56,
    width: "92%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 10,
    borderColor: "#41E1FD",
    borderWidth: 2,
    borderRadius: 4,
    paddingVertical:5
  },
  inputLabel: {
    height: 50,
    width: "99%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  labelTextWrapper: {
    height: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  valueWrapper: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconWrapper: {
    height: 50,
    flexDirection: "row",
    width: "7%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  labelText: {
    // fontSize: 16,
    lineHeight: 20,
    minHeight: 20,
    color: "#ADADAD",
    fontFamily: "roboto",
    textAlign: "left",
    fontWeight: "300",
    paddingStart: 5,
    flex: 1,
  },
  iconStyle: {
    fontFamily: "roboto",
    alignSelf: "center",
    fontSize: 18,
    lineHeight: 20,
    height: 20,
    color: "#41E1FD",
  },
  inputText: {
    // fontSize: 18,
    lineHeight: 20,
    minHeight: 20,
    color: "#575757",
    fontFamily: "roboto",
    alignSelf: "center",
    fontWeight: "100",
  },
});

export default styles;
