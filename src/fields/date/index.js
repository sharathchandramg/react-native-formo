import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
  View as RNView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Calendar } from "react-native-calendars";
import { View, ArrowForwardIcon } from "native-base";

import StarIcon from "../../components/starIcon";
import { isEmpty } from "./../../utils/validators";

const moment = require("moment");

export default class DateField extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    updateValue: PropTypes.func,
    timeZoneOffsetInHours: PropTypes.number,
    theme: PropTypes.object,
    ErrorComponent: PropTypes.func,
    // Parent owns "based on other form fields" logic and returns the dates.
    // Resolves to: { availableDates?, blockedDates?, minDate?, maxDate? }
    fetchAvailableDates: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: false,
      availableDates: new Set(),
      blockedDates: new Set(),
      minDate: null,
      maxDate: null,
      tempSelected: null, // pending selection, committed only on Confirm
      displayMonth: null, // 'YYYY-MM-DD' first-of-month currently shown
      panelYear: null, // year being browsed in the month/year panel
      showMonthYear: false, // toggles the month+year picker panel
      calendarKey: 0, // bump to force the calendar to jump to displayMonth
    };
    this.reqId = 0;
  }

  componentDidMount() {
    if (this.usesCalendar()) this.loadAvailability();
  }

  componentDidUpdate(prevProps) {
    if (
      this.usesCalendar() &&
      this.dependencyKey(prevProps.attributes) !==
        this.dependencyKey(this.props.attributes)
    ) {
      this.loadAvailability();
    }
  }

  usesCalendar = () => this.props.attributes.mode === "date";

  dependencyKey = (attrs) =>
    (attrs &&
      attrs.additional_config &&
      attrs.additional_config.dependency_key) ||
    "";

  // ---- small helpers ----

  pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);

  firstOfMonth = (year, month0) => `${year}-${this.pad2(month0 + 1)}-01`;

  clampDisplayMonth = (ds) => {
    const { minDate, maxDate } = this.state;
    let d = moment(ds, "YYYY-MM-DD").startOf("month");
    if (minDate) {
      const lo = moment(minDate, "YYYY-MM-DD").startOf("month");
      if (d.isBefore(lo)) d = lo;
    }
    if (maxDate) {
      const hi = moment(maxDate, "YYYY-MM-DD").startOf("month");
      if (d.isAfter(hi)) d = hi;
    }
    return d.format("YYYY-MM-DD");
  };

  // ---- value handling (unchanged contract: store UTC epoch millis) ----

  onDateChange = (date) => {
    const epoch = moment(date).utc().valueOf();
    this.props.updateValue(this.props.attributes.name, epoch);
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  openPicker = () => {
    const { attributes } = this.props;
    if (this.usesCalendar()) {
      const ds = !isEmpty(attributes.value)
        ? moment.utc(attributes.value).format("YYYY-MM-DD")
        : null;
      const displayMonth = this.clampDisplayMonth(
        ds || moment().format("YYYY-MM-DD")
      );
      this.setState((s) => ({
        tempSelected: ds,
        displayMonth,
        panelYear: moment(displayMonth, "YYYY-MM-DD").year(),
        showMonthYear: false,
        calendarKey: s.calendarKey + 1,
        modalVisible: true,
      }));
    } else {
      this.setState({ modalVisible: true });
    }
  };

  onCalendarDayPress = (day) => {
    const ds = day.dateString;
    if (!this.isSelectable(ds)) return;
    this.setState({ tempSelected: ds });
  };

  confirmCalendar = () => {
    const ds = this.state.tempSelected;
    if (ds && this.isSelectable(ds)) {
      const epoch = moment.utc(ds, "YYYY-MM-DD").valueOf();
      this.props.updateValue(this.props.attributes.name, epoch);
    }
    this.setModalVisible(false);
  };

  // ---- month / year navigation ----

  openMonthYear = () =>
    this.setState((s) => ({
      showMonthYear: true,
      panelYear: moment(s.displayMonth, "YYYY-MM-DD").year(),
    }));

  jumpToMonth = (year, month0) => {
    const ds = this.clampDisplayMonth(this.firstOfMonth(year, month0));
    this.setState((s) => ({
      displayMonth: ds,
      showMonthYear: false,
      calendarKey: s.calendarKey + 1, // remount so the calendar jumps there
    }));
  };

  dateFormatter = (date) => {
    switch (date) {
      case "today":
        return new Date();
      case "tomorrow":
        return new Date(moment().add(1, "days"));
      case "yesterday":
        return new Date(moment().subtract(1, "days"));
      default:
        if (!isNaN(date)) {
          return new Date(parseInt(date) * 1000);
        } else {
          return new Date();
        }
    }
  };

  toDateString = (v) =>
    v ? moment(this.dateFormatter(v)).format("YYYY-MM-DD") : null;

  // ---- availability ----

  loadAvailability = async () => {
    const { attributes, fetchAvailableDates } = this.props;
    const cfg = attributes.additional_config || {};

    let available = cfg.available_dates || null;
    let blocked = cfg.blocked_dates || null;
    let minDate = this.toDateString(attributes.minDate);
    let maxDate = this.toDateString(attributes.maxDate);

    const myReq = ++this.reqId;

    if (typeof fetchAvailableDates === "function") {
      try {
        this.setState({ loading: true });
        const res = (await fetchAvailableDates(attributes)) || {};
        if (myReq !== this.reqId) return;
        if (res.availableDates) available = res.availableDates;
        if (res.blockedDates) blocked = res.blockedDates;
        if (res.minDate) minDate = this.toDateString(res.minDate);
        if (res.maxDate) maxDate = this.toDateString(res.maxDate);
      } catch (e) {
        if (myReq !== this.reqId) return;
      } finally {
        if (myReq === this.reqId) this.setState({ loading: false });
      }
    }

    const availableSet = new Set(available || []);
    const blockedSet = new Set(blocked || []);

    if (!minDate && availableSet.size) minDate = [...availableSet].sort()[0];
    if (!maxDate && availableSet.size)
      maxDate = [...availableSet].sort().slice(-1)[0];

    this.setState(
      { availableDates: availableSet, blockedDates: blockedSet, minDate, maxDate },
      this.clearStaleSelection
    );
  };

  clearStaleSelection = () => {
    const { attributes } = this.props;
    if (isEmpty(attributes.value)) return;
    const ds = moment.utc(attributes.value).format("YYYY-MM-DD");
    if (!this.isSelectable(ds)) {
      this.props.updateValue(attributes.name, null);
    }
  };

  isSelectable = (ds) => {
    const { availableDates, blockedDates, minDate, maxDate } = this.state;
    if (minDate && ds < minDate) return false;
    if (maxDate && ds > maxDate) return false;
    if (availableDates.size) return availableDates.has(ds);
    if (blockedDates.size) return !blockedDates.has(ds);
    return true;
  };

  buildMarkedDates = () => {
    const { theme } = this.props;
    const { availableDates, blockedDates, minDate, maxDate, tempSelected } =
      this.state;
    const marks = {};
    const selectedColor = (theme && theme.pickerColorSelected) || "#007aff";

    if (availableDates.size && minDate && maxDate) {
      const d = moment.utc(minDate);
      const end = moment.utc(maxDate);
      while (d.isSameOrBefore(end)) {
        const ds = d.format("YYYY-MM-DD");
        if (!availableDates.has(ds)) {
          marks[ds] = { disabled: true, disableTouchEvent: true };
        }
        d.add(1, "day");
      }
    } else if (blockedDates.size) {
      blockedDates.forEach((ds) => {
        marks[ds] = { disabled: true, disableTouchEvent: true };
      });
    }

    if (tempSelected) {
      marks[tempSelected] = {
        ...(marks[tempSelected] || {}),
        selected: true,
        selectedColor,
        disabled: false,
        disableTouchEvent: false,
      };
    }
    return marks;
  };

  // ---- field row (display) ----

  renderDatePicker = () => {
    const { theme, attributes, AppNBText } = this.props;
    const value = (attributes.value && moment(attributes.value)) || null;
    let dateValue = "Select";
    let isFieldDatePart = false;
    if (
      attributes &&
      attributes.additional_config &&
      attributes.additional_config.data_source &&
      ["server"].includes(attributes.additional_config.data_source)
    ) {
      dateValue = "Server Time";
    } else {
      switch (attributes.mode) {
        case "datetime":
          const datetimeFormat = attributes["is_24hour"]
            ? "Do MMM YYYY HH:mm"
            : "Do MMM YYYY hh:mm a";
          dateValue = value && moment(value).format(datetimeFormat);
          break;
        case "date":
          dateValue =
            attributes.value &&
            moment.utc(attributes.value).format("Do MMM YYYY");
          break;
        case "time":
          const timeFormat = attributes["is_24hour"] ? "HH:mm" : "hh:mm a";
          dateValue = value && moment(value).format(timeFormat);
          break;
        case "dayofweek":
        case "dayofthemonth":
        case "weekno":
        case "monthno":
        case "monthname":
        case "year":
          isFieldDatePart = true;
          dateValue = !isEmpty(attributes.value) ? attributes.value : "";
          break;
        default:
          dateValue = value && moment(value).format("Do MMM YYYY HH:mm");
          break;
      }
    }

    return (
      <View
        style={{
          borderBottomColor: attributes["error"]
            ? theme.errorMsgColor
            : theme.inputBorderColor,
          borderBottomWidth: theme.borderWidth,
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
          paddingStart: 5,
        }}
      >
        {attributes["required"] && (
          <StarIcon required={attributes["required"]} AppNBText={AppNBText} />
        )}
        <AppNBText
          size={16}
          style={{
            flex: 1,
            color: theme.inputColorPlaceholder,
            paddingStart: 5,
          }}
          onPress={() => {
            if (attributes.editable && !isFieldDatePart) this.openPicker();
          }}
        >
          {attributes.label}
        </AppNBText>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, right: 50, left: 50 }}
          style={{
            marginHorizontal: 5,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={() => {
            if (attributes.editable && !isFieldDatePart) this.openPicker();
          }}
        >
          <AppNBText
            size={16}
            style={{
              paddingEnd: 10,
              color: !attributes.editable
                ? theme.inputColorPlaceholder
                : theme.pickerColorSelected,
            }}
          >
            {dateValue}
          </AppNBText>
          {!isFieldDatePart && (
            <ArrowForwardIcon size={"6"} color={theme.inputColorPlaceholder} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Tappable calendar header title -> opens the month/year panel.
  renderHeaderTitle = () => {
    const { theme } = this.props;
    const inputColor = (theme && theme.inputColor) || "#1c1c1e";
    const accent = (theme && theme.pickerColorSelected) || "#007aff";
    const label = moment(this.state.displayMonth, "YYYY-MM-DD").format(
      "MMMM YYYY"
    );
    return (
      <TouchableOpacity onPress={this.openMonthYear} style={styles.titleBtn}>
        <Text style={[styles.titleText, { color: inputColor }]}>{label}</Text>
        <Text style={[styles.titleChevron, { color: accent }]}> ▾</Text>
      </TouchableOpacity>
    );
  };

  renderMonthYearPanel = () => {
    const { theme } = this.props;
    const { panelYear, displayMonth, minDate, maxDate } = this.state;
    const accent = (theme && theme.pickerColorSelected) || "#007aff";
    const inputColor = (theme && theme.inputColor) || "#1c1c1e";
    const disabledColor = "#c4c4c6";

    const months = moment.monthsShort(); // ['Jan', ... 'Dec']
    const minYear = minDate ? moment(minDate).year() : panelYear - 12;
    const maxYear = maxDate ? moment(maxDate).year() : panelYear + 12;
    const minMonth = minDate ? moment(minDate).month() : 0;
    const maxMonth = maxDate ? moment(maxDate).month() : 11;
    const selYear = moment(displayMonth, "YYYY-MM-DD").year();
    const selMonth = moment(displayMonth, "YYYY-MM-DD").month();

    const atMinYear = panelYear <= minYear;
    const atMaxYear = panelYear >= maxYear;

    return (
      <RNView style={styles.panel}>
        <RNView style={styles.yearRow}>
          <TouchableOpacity
            disabled={atMinYear}
            onPress={() => this.setState({ panelYear: panelYear - 1 })}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text
              style={[styles.yearArrow, { color: atMinYear ? disabledColor : accent }]}
            >
              ‹
            </Text>
          </TouchableOpacity>
          <Text style={[styles.yearText, { color: inputColor }]}>{panelYear}</Text>
          <TouchableOpacity
            disabled={atMaxYear}
            onPress={() => this.setState({ panelYear: panelYear + 1 })}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text
              style={[styles.yearArrow, { color: atMaxYear ? disabledColor : accent }]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </RNView>

        <RNView style={styles.monthGrid}>
          {months.map((mLabel, idx) => {
            const disabled =
              (panelYear === minYear && idx < minMonth) ||
              (panelYear === maxYear && idx > maxMonth);
            const isSel = panelYear === selYear && idx === selMonth;
            return (
              <TouchableOpacity
                key={mLabel}
                disabled={disabled}
                style={styles.monthCell}
                onPress={() => this.jumpToMonth(panelYear, idx)}
              >
                <RNView
                  style={[styles.monthPill, isSel && { backgroundColor: accent }]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: disabled
                        ? disabledColor
                        : isSel
                        ? "#fff"
                        : inputColor,
                    }}
                  >
                    {mLabel}
                  </Text>
                </RNView>
              </TouchableOpacity>
            );
          })}
        </RNView>
      </RNView>
    );
  };

  // ---- calendar bottom-sheet (date mode) ----

  renderCalendarModal = () => {
    const { theme } = this.props;
    const { modalVisible, loading, minDate, maxDate, displayMonth, showMonthYear, calendarKey } =
      this.state;
    const accent = (theme && theme.pickerColorSelected) || "#007aff";
    const sheetBg = (theme && theme.primaryBgColor) || "#ffffff";

    return (
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => this.setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <TouchableOpacity
            style={styles.backdropTouch}
            activeOpacity={1}
            onPress={() => this.setModalVisible(false)}
          />

          <View style={styles.sheetWrap}>
            <View style={[styles.sheet, { backgroundColor: sheetBg }]}>
              {loading ? (
                <ActivityIndicator style={{ padding: 40 }} color={accent} />
              ) : showMonthYear ? (
                this.renderMonthYearPanel()
              ) : (
                <Calendar
                  key={`cal-${calendarKey}`}
                  current={displayMonth || undefined}
                  minDate={minDate || undefined}
                  maxDate={maxDate || undefined}
                  markedDates={this.buildMarkedDates()}
                  disableAllTouchEventsForDisabledDays
                  onDayPress={this.onCalendarDayPress}
                  onMonthChange={(m) =>
                    this.setState({
                      displayMonth: this.firstOfMonth(m.year, m.month - 1),
                    })
                  }
                  customHeaderTitle={this.renderHeaderTitle()}
                  theme={{
                    backgroundColor: sheetBg,
                    calendarBackground: sheetBg,
                    selectedDayBackgroundColor: accent,
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: accent,
                    arrowColor: accent,
                    dayTextColor: (theme && theme.inputColor) || "#1c1c1e",
                    monthTextColor: (theme && theme.inputColor) || "#1c1c1e",
                    textDisabledColor: "#c4c4c6",
                    textMonthFontWeight: "600",
                  }}
                />
              )}

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={this.confirmCalendar}
              >
                <Text style={[styles.confirmText, { color: accent }]}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.sheet, styles.cancelSheet, { backgroundColor: sheetBg }]}
              onPress={() => this.setModalVisible(false)}
            >
              <Text style={[styles.cancelText, { color: accent }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // ---- native modal (datetime / time modes) ----

  renderDatePickerModal = (attributes) => {
    const currentDate = attributes.value
      ? new Date(attributes.value)
      : new Date();
    return (
      <DateTimePickerModal
        isVisible={this.state.modalVisible}
        date={currentDate}
        mode={attributes.mode}
        minimumDate={
          attributes.minDate && this.dateFormatter(attributes.minDate)
        }
        maximumDate={
          attributes.maxDate && this.dateFormatter(attributes.maxDate)
        }
        is24Hour={attributes["is_24hour"] ? true : false}
        onConfirm={(selectedDate) => {
          this.onDateChange(selectedDate);
          this.setModalVisible(false);
        }}
        onCancel={() => this.setModalVisible(false)}
        locale={attributes["is_24hour"] && "en_GB"}
      />
    );
  };

  render() {
    const { theme, attributes, ErrorComponent, AppRNText } = this.props;
    return (
      <View>
        <View style={{ height: 50, paddingHorizontal: 15 }}>
          {this.renderDatePicker()}
        </View>
        {this.usesCalendar()
          ? this.renderCalendarModal()
          : this.renderDatePickerModal(attributes)}
        <View style={{ paddingHorizontal: 15 }}>
          <ErrorComponent {...{ attributes, theme, AppRNText }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  backdropTouch: { flex: 1 },
  sheetWrap: { paddingHorizontal: 8, paddingBottom: 28 },
  sheet: { borderRadius: 14, overflow: "hidden" },
  confirmBtn: {
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#d1d1d6",
  },
  confirmText: { fontSize: 18, fontWeight: "600" },
  cancelSheet: { marginTop: 8, paddingVertical: 16, alignItems: "center" },
  cancelText: { fontSize: 18, fontWeight: "700" },

  // tappable header title
  titleBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  titleText: { fontSize: 17, fontWeight: "600" },
  titleChevron: { fontSize: 13, fontWeight: "700" },

  // month/year panel
  panel: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12, minHeight: 300 },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  yearArrow: { fontSize: 30, paddingHorizontal: 28, fontWeight: "600" },
  yearText: { fontSize: 20, fontWeight: "700", minWidth: 90, textAlign: "center" },
  monthGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  monthCell: { width: "33.333%", alignItems: "center", paddingVertical: 8 },
  monthPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
});