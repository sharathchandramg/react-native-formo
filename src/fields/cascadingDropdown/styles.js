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
    paddingVertical: 5,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    paddingStart: 5,
  },
  label: {
    paddingStart: 5,
    fontSize: 16,
  },
  input: {
    minHeight: 40,
    borderColor: "#41E1FD",
    borderWidth: 2,
    borderRadius: 4,
    paddingLeft: 10,
  },
  itemWrapper: {
    padding: 10,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default styles;
