import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  inputField: {
    minHeight: 60,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderBottomColor: "#D9D5DC",
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
  errorField: {
    height: 20,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
    width: "99%",
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
    lineHeight: 20,
    color: "#ADADAD",
    fontFamily: "roboto",
    textAlign: "left",
    fontWeight: "300",
    paddingStart: 5,
    flex: 1,
  },
  inputText: {
    fontSize: 18,
    lineHeight: 20,
    color: "#575757",
    fontFamily: "roboto",
    alignSelf: "center",
    fontWeight: "100",
  },
  image: {
    height: 100,
    width: "100%",
  },

  valueContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "50%",
    marginEnd: 15,
    backgroundColor: "green",
  },

  button: {
    height: 50,
    backgroundColor: "#48BBEC",
    margin: 0,
    alignSelf: "stretch",
    justifyContent: "center",
  },

  topContainer: {
    overflow: "hidden",
    marginBottom: 5,
    height: 150,
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderRadius: 4,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "grey",
  },
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  modalPreview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default styles;