import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cascadingRoot: {
    marginHorizontal: 15,
  },
  labelWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 2,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    paddingStart: 5,
  },
  label: {
    paddingStart: 4,
    fontSize: 18,
  },
  inputWrapper: {
    backgroundColor: "white",
    borderColor: "#41E1FD",
    borderWidth: 2,
    borderRadius: 4,
  },
  input: {
    minHeight: 50,
    paddingLeft: 10,
    fontSize: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  listWrapper: {
    borderWidth: 1,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
    borderColor: "#D9D5DC",
  },
  itemWrapper: {
    padding: 10,
    borderColor: "#D9D5DC",
    borderBottomWidth: 0.5,
  },
  itemLabel: { color: "#ADADAD", fontSize: 16 },
});

export default styles;
