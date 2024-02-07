import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  inputBorder: {
    borderColor: "#41E1FD",
    borderWidth: 2,
    borderRadius: 4,
  },
  labelText: {
    opacity: 0,
    position: "absolute",
    fontSize: 16,
    paddingStart: 5,
    lineHeight: 18,
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  inputBtnWrapper: {
    flexDirection: "row",
  },
  btnWrapper: {
    width: "30%",
  },
  btn: {
    height: 60,
    margin: 0,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 16,
    color: "white",
    alignSelf: "center",
    fontWeight: "700",
    paddingHorizontal: 5,
  },
  errorSuccessWrapper: {
    paddingHorizontal: 15,
  },
  inputWrapper:{
    width: "70%" 
  },
  input: {
    height: 60,
    borderWidth: 0,
    fontSize: 18,
    ...Platform.select({
      ios: {
        lineHeight: 30,
      },
      android: {
        textAlignVertical: "bottom",
      },
    }),
  },
  animatedLabel: {
    position: "absolute",
    left: 0,
    fontSize: 16,
    paddingStart: 5,
    width: "100%",
  },
});

export default styles;
