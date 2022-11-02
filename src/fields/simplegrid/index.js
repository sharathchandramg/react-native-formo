import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity, Modal } from "react-native";
import { View, Text, ArrowForwardIcon } from "native-base";
import _ from "lodash";
import styles from "./styles";
import { EditComponent, GridComponent } from "../../components/grid";
import { isEmpty } from "../../utils/validators";
import StarIcon from "../../components/starIcon";

export default class SimpleGrideView extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      editModal: false,
      selectedItm: {},
      data: {},
      rowData: null,
      rowIndex: 0,
    };
  }

  componentDidMount() {
    const { attributes } = this.props;
    if (attributes) {
      const data = this.getGridData();
      if (Object.keys(data).length) {
        this.setGridData(data);
      }
    }
  }

  getGridData = () => {
    const { attributes } = this.props;
    let mData = null;
    if (attributes) {
      if (
        !isEmpty(attributes["value"]) &&
        !isEmpty(attributes["value"]["data"])
      ) {
        const summary = attributes["value"];
        const selectedItm = summary["data"];
        mData = attributes["data"];
        if (!isEmpty(selectedItm)) {
          _.forEach(Object.keys(selectedItm), (rowKey) => {
            if (mData.hasOwnProperty(rowKey)) {
              mData[rowKey] = selectedItm[rowKey];
            }
          });
        }
      } else {
        mData = attributes["data"];
      }
    }
    return mData;
  };

  setGridData = (data) => {
    const header = data["header"];
    const header_type = data["type"];
    let summary = {};
    Object.keys(header).map((ck) => {
      let ckTotal = 0;
      let count = 0;
      Object.keys(data).map((rk) => {
        if (
          !rk.match(/header/) &&
          !rk.match(/style/) &&
          !rk.match(/type/) &&
          rk !== `${String.fromCharCode(931)}`
        ) {
          if (header_type && header_type[ck].toLowerCase() === "number") {
            const ckValue = data[rk][ck] || "0";
            if (ckValue) {
              ckTotal = parseInt(ckTotal) + parseInt(ckValue);
            }
          } else if (
            header_type &&
            (header_type[ck].toLowerCase() === "string" ||
              header_type[ck].toLowerCase() === "text")
          ) {
            const ckValue = data[rk][ck];
            if (ckValue) {
              count += 1;
              ckTotal = count;
            }
          }
        }
      });
      summary[`${ck}`] = ckTotal;
    });
    data[`${String.fromCharCode(931)}`] = summary;
    this.setState({ data: data });
  };

  getFormattedNumber = (value) => {
    return Number(parseFloat(value).toFixed(2));
  };

  handleOnSaveClick = () => {
    let data = this.state.data;
    let rowData = this.state.rowData;
    let selectedItm = this.state.selectedItm;
    if (!isEmpty(rowData) && Array.isArray(rowData)) {
      _.forEach(rowData, (item) => {
        const rk = item["rowKey"];
        const ck = item["colKey"];
        const value = item["value"];
        const preColSum = data[`${String.fromCharCode(931)}`][ck];
        const header_type = data["type"];
        const ck_type = header_type[ck];
        if (ck_type.toLowerCase() === "number") {
          const preColVal = data[rk][ck] || "0";
          data[rk][ck] = value;
          if (value && !isNaN(value)) {
            if (preColVal) {
              const diff =
                this.getFormattedNumber(value) -
                this.getFormattedNumber(preColVal);
              data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
                this.getFormattedNumber(preColSum) + diff
              );
            } else {
              data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
                this.getFormattedNumber(preColSum) +
                  this.getFormattedNumber(value)
              );
            }
          } else {
            data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
              this.getFormattedNumber(preColSum) -
                this.getFormattedNumber(preColVal)
            );
          }
        } else if (
          ck_type.toLowerCase() === "string" ||
          ck_type.toLowerCase() === "text"
        ) {
          const preColVal = data[rk][ck] || "";
          data[rk][ck] = value;
          if (value) {
            if (preColVal) {
              data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum);
            } else {
              data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum) + 1;
            }
          } else {
            data[`${String.fromCharCode(931)}`][ck] = preColSum
              ? parseInt(preColSum) - 1
              : parseInt(preColSum);
          }
        }
        selectedItm[rk] = data[rk];
      });
      this.setState({ data: data, selectedItm: selectedItm, editModal: false });
    } else {
      this.setState({ editModal: false });
    }
  };

  handleOnDoneClick = () => {
    let summary = {
      label: this.getSummaryLabel(),
      data: this.state.data,
    };
    this.props.updateValue(this.props.attributes.name, summary);
    this.setState({ modalVisible: false });
  };

  onChangeText = (rk, ck, text) => {
    let rowData = this.state.rowData;
    rowData = _.map(rowData, (item) => {
      if (item["rowKey"] === rk && item["colKey"] === ck) {
        item["value"] = text;
      }
      return item;
    });
    this.setState({ rowData: rowData });
  };

  toggleModal = () => {
    if (this.state.modalVisible) {
      this.setState({
        modalVisible: false,
      });
    } else {
      const { attributes } = this.props;
      if (attributes) {
        const data = this.getGridData();
        if (Object.keys(data).length) {
          this.setGridData(data);
        }
      }
      this.setState({ modalVisible: true });
    }
  };

  toggleEditModal = (rowData, rowIndex) => {
    const editModal = this.state.editModal;
    if (editModal) {
      this.setState({ editModal: false, rowData: null, rowIndex: 0 });
    } else {
      this.setState({ editModal: true, rowData: rowData, rowIndex: rowIndex });
    }
  };

  getLabel = (value) => {
    let label = "None";
    if (typeof value !== "undefined" && value && Object.keys(value).length) {
      return value.label ? value.label : "None";
    }
    return label;
  };

  renderChecklistIcon = () => {
    return (
      <TouchableOpacity onPress={() => this.toggleModal()}>
        <ArrowForwardIcon size={"6"} color={"#41E1FD"} />
      </TouchableOpacity>
    );
  };

  getSummaryLabel = () => {
    const data = this.state.data;
    let rowLabel = "";
    if (!isEmpty(data) && Object.keys(data).length) {
      const summaryRow = data[`${String.fromCharCode(931)}`];
      const header_type = data["type"];
      Object.keys(summaryRow).map((key) => {
        const type = header_type[key];
        let colLabel = "";
        if (type.toLowerCase() === "number") {
          colLabel = `${key} : ${summaryRow[key]}`;
          if (rowLabel && rowLabel.length) {
            rowLabel = `${rowLabel}, ${colLabel}`;
          } else {
            rowLabel = `${colLabel}`;
          }
        } else if (
          type.toLowerCase() === "string" ||
          type.toLowerCase() === "text"
        ) {
          colLabel = `${key} :${summaryRow[key]}`;
          if (rowLabel && rowLabel.length) {
            rowLabel = `${rowLabel}, ${colLabel}`;
          } else {
            rowLabel = `${colLabel}`;
          }
        }
      });
    }
    return rowLabel;
  };

  // added now

  getTableHeader = (data) => {
    let tableHeader = [];
    if (data && Object.keys(data).length && !isEmpty(data["header"])) {
      const header = data["header"];
      Object.keys(header).map((hk) => {
        let headerCell = {
          rowKey: "#",
          colKey: hk,
          type: "string",
          value: header[hk],
          editable: false,
        };
        tableHeader.push(headerCell);
      });
    }
    if (tableHeader.length) {
      tableHeader.unshift({
        rowKey: "#",
        colKey: "#",
        type: "string",
        value: "#",
        editable: false,
      });
    }
    return tableHeader;
  };

  getRowTitle = (data) => {
    let tableTitle = [];
    if (data && Object.keys(data).length) {
      Object.keys(data).map((rk) => {
        if (
          !rk.match(/header/) &&
          !rk.match(/style/) &&
          !rk.match(/type/) &&
          rk !== `${String.fromCharCode(931)}`
        ) {
          let titleCell = {
            rowKey: rk,
            colKey: "",
            type: "string",
            value: rk,
            editable: false,
          };
          tableTitle.push(titleCell);
        }
      });
    }
    return tableTitle;
  };

  getTableData = (data) => {
    let tableData = [];
    if (data && Object.keys(data).length && !isEmpty(data["type"])) {
      Object.keys(data).map((rk) => {
        if (
          !rk.match(/header/) &&
          !rk.match(/style/) &&
          !rk.match(/type/) &&
          rk !== `${String.fromCharCode(931)}`
        ) {
          let dataItem = {};
          dataItem["name"] = rk;
          let value = [];
          Object.keys(data[rk]).map((ck) => {
            let dataCell = {
              rowKey: rk,
              colKey: ck,
              type: data.type[ck],
              value: data[rk][ck],
              editable: rk == `${String.fromCharCode(931)}` ? false : true,
            };
            value.push(dataCell);
          });
          dataItem["data"] = value;
          tableData.push(dataItem);
        }
      });
    }
    return tableData;
  };

  getHeaderWidth = (data) => {
    let widthArr = [];
    if (data && Object.keys(data).length && !isEmpty(data["style"])) {
      const column_width = data["style"]["column_width"];
      widthArr = Object.keys(column_width).map((key) => {
        return parseInt(column_width[key]);
      });
    } else {
      if (!isEmpty(data["header"])) {
        const len = Object.keys(data["header"]).length;
        for (let i = 0; i < len; i++) {
          widthArr.push(100);
        }
      }
    }

    return widthArr;
  };

  getRowHeight = (data) => {
    let height = 40;
    if (data && Object.keys(data).length && !isEmpty(data["style"])) {
      if (!isEmpty(data["style"]["row_height"])) {
        height = parseInt(data["style"]["row_height"]);
      }
    }
    return height;
  };

  renderComponent = () => {
    const { theme, attributes } = this.props;
    const editModal = this.state.editModal;
    const rowData = this.state.rowData;
    if (editModal) {
      return (
        <EditComponent
          theme={theme}
          attributes={attributes}
          rowData={rowData}
          onChangeText={this.onChangeText}
          handleOnSaveClick={this.handleOnSaveClick}
          toggleModalVisible={this.toggleEditModal}
        />
      );
    }
  };

  render() {
    const { theme, attributes, ErrorComponent } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.inputLabelWrapper, { width: "95%" }]}>
          <TouchableOpacity
            style={styles.inputLabel}
            error={theme.changeTextInputColorOnError ? attributes.error : null}
            onPress={() => this.toggleModal()}
          >
            <View style={styles.labelTextWrapper}>
              {attributes["required"] && (
                <StarIcon required={attributes["required"]} />
              )}

              <Text style={styles.labelText}>{attributes.label}</Text>
            </View>
            <View
              style={[
                styles.valueWrapper,
                { paddingLeft: attributes["required"] ? 13 : 5 },
              ]}
            >
              <Text style={styles.inputText}>
                {this.getLabel(attributes.value)}{" "}
              </Text>
              {this.renderChecklistIcon()}
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme }} />
        </View>
        {
          <Modal
            visible={this.state.modalVisible}
            animationType="none"
            transparent={true}
            onRequestClose={() => this.toggleModal()}
          >
            {this.state.editModal ? (
              this.renderComponent()
            ) : (
              <GridComponent
                modalVisible={this.state.modalVisible}
                theme={theme}
                attributes={attributes}
                toggleModalVisible={this.toggleModal}
                toggleEditModal={this.toggleEditModal}
                data={this.state.data}
                handleOnDoneClick={this.handleOnDoneClick}
                summary={this.getSummaryLabel()}
                rowHeight={this.getRowHeight(this.state.data)}
                widthArr={this.getHeaderWidth(this.state.data)}
                tableHeader={this.getTableHeader(this.state.data)}
                rowTitle={this.getRowTitle(this.state.data)}
                tableData={this.getTableData(this.state.data)}
              />
            )}
          </Modal>
        }
      </View>
    );
  }
}
