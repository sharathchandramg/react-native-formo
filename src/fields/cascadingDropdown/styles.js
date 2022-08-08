import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cascadingRoot: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  labelWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
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
    borderColor: "#D9D5DC",
    backgroundColor: "#41E1FD",
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    minHeight: 50,
    borderColor: "#41E1FD",
    borderWidth: 2,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#41E1FD",
    elevation: 4,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 0 },
    paddingStart: 5,
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
