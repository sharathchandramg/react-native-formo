import React from "react";
import { TouchableOpacity, View, Platform } from "react-native";

import CustomHeader from "../headers/header";
import styles from "./styles";
import { isEmpty } from "../../utils/validators";

const EditComponent = (props) => {
  const {
    theme,
    rowData,
    onChangeText,
    handleOnSaveClick,
    AppNBInput,
    AppRNText,
  } = props;

  renderItemList = (rowData) => {
    return rowData ? (
      <View style={{ borderBottomWidth: 0, paddingVertical: 5, flex: 1 }}>
        <View style={{ marginVertical: 20 }}>
          <AppRNText size={18} style={styles.topLabel}>
            {rowData[0]["rowKey"] || ""}
          </AppRNText>
        </View>

        {rowData.map((item, i) => {
          const keyboardType =
            item["type"] && item["type"].toLowerCase() === "number"
              ? "numeric"
              : "default";
          const editable = !item["editable"] ? item["editable"] : true;
          return (
            <View
              key={`${item["rowKey"] + "" + item["colKey"]}`}
              style={{ marginBottom: 5 }}
            >
              <View style={{ height: 50 }}>
                <AppNBInput
                  size={16}
                  style={{
                    height: Platform.OS === "ios" ? undefined : null,
                    paddingStart: 5,
                  }}
                  underlineColorAndroid="transparent"
                  numberOfLines={5}
                  maxLength={100}
                  multiline={true}
                  placeholder={item["colKey"] || "None"}
                  placeholderTextColor={theme.inputColorPlaceholder}
                  onChangeText={(text) =>
                    onChangeText(item["rowKey"], item["colKey"], text)
                  }
                  value={item["value"]}
                  keyboardType={keyboardType}
                  editable={editable}
                />
              </View>
            </View>
          );
        })}
      </View>
    ) : null;
  };

  return (
    <View style={styles.modalContent}>
      <CustomHeader {...props} />
      <View style={{ marginBottom: 50, flex: 1 }}>
        <View style={styles.container}>
          {!isEmpty(rowData) && Array.isArray(rowData)
            ? renderItemList(rowData)
            : null}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleOnSaveClick()}
      >
        <AppRNText size={16} style={styles.buttonText}>
          {"SAVE"}{" "}
        </AppRNText>
      </TouchableOpacity>
    </View>
  );
};

export default EditComponent;
