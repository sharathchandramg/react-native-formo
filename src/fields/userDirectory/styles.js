import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
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
    paddingVertical:5
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
    paddingTop: 5,
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
    color: "#575757",
    fontFamily: "roboto",
    fontWeight: "100",
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  button: {
    height: 50,
    backgroundColor: "#48BBEC",
    margin: 0,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
  },
  selectedContainer: {
    height: 40,
    width: "50%",
  },

  selectedStatusOuter: {
    height: 30,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#6AD97B",
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },

  selectedText: {
    color: "white",
    fontFamily: "roboto",
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    fontSize: 12,
    width: "70%",
  },

  removeFilterIcon: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    marginEnd: 10,
  },

  noDataWrapper: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  nodataText: {
    height: 30,
    lineHeight: 20,
    color: "#989898",
    fontFamily: "roboto",
    width: "100%",
    fontSize: 14,
    padding: 5,
    fontWeight: "700",
    alignSelf: "center",
    textAlign: "center",
  },
  headerWrapper: {
    alignSelf: "stretch",
    backgroundColor: "rgb(255,255,255)",
    height: 60,
    ...Platform.select({
      ios: {
        paddingTop: 30,
        marginBottom: 30,
      },
      android: {
        paddingTop: 0,
        marginBottom: 0,
      },
    }),
  },
  header: {
    alignSelf: "stretch",
    backgroundColor: "rgb(255,255,255)",
    flexDirection: "row",
    elevation: 5,
    height: 59,
  },
  headerLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenterIconView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    flexDirection: "column",
    borderTopWidth: 2,
    borderColor: "#d6d7da",
    elevation: 20,
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  headerBottom: {
    height: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    elevation: 2,
    opacity: 1,
    backgroundColor: "transparent",
  },
  headerRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  searchBar: {
    height: 40,
    alignSelf: "stretch",
    color: "rgb(0,151,235)",
    fontSize: 18,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});

export default styles;
