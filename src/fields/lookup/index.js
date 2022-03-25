import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import _ from 'lodash';
import { View, Text, ArrowForwardIcon } from 'native-base';
import { RNCamera } from "react-native-camera";

import { isEmpty } from '../../utils/validators';
import styles from './styles';
import SearchComponent from '../../components/search';
import LookupComponent from '../../components/lookup';
import FilterComponent from '../../components/filter';
import StarIcon from "../../components/starIcon";

export default class LookupField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        onGetQuery: PropTypes.func,
        onSearchQuery: PropTypes.func,
        onAddLookup: PropTypes.func,
        closeLookupModal: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.timeout = 0;
        this.state = {
            modalVisible: false,
            searchModalVisible: false,
            filterModalVisible: false,
            searchText: '',
            options: [],

            activeCategoryData: [],
            filterData: [],
            filterArr: [],
            activeCategory: null,
            categoryToValue: [],
            loading: false,
            barcodeSearchText:'',
            barcodeModalVisible: false,
            selectedFilter: []
        };
    }

    componentDidMount() {
        this.setInitialData();
    }

    /**
     * On barcode search, if we get only one option
     * automatically select option and close lookup modal
     */
    componentDidUpdate(){
        if (this.props.closeModal) {
          this.setState({ modalVisible: false });
          this.props.closeLookupModal();
        }
    }

    componentWillUnmount() {
        this.setState({
            modalVisible: false,
            searchModalVisible: false,
            filterModalVisible: false,
        });
    }

    setInitialData = () => {
        const { attributes } = this.props;
        if (!isEmpty(attributes) && !isEmpty(attributes['data_source'])) {
            const { type, key, url } = attributes['data_source'];
            if (!isEmpty(type) && type === 'remote') {
                let len = attributes['options']
                    ? attributes['options'].length
                    : 0;
                let offset = len;
                this.handleOnGetQuery(offset);
            } else {
                this.setLocalOptions(attributes['options']);
            }
        } else {
            this.setLocalOptions(attributes['options']);
        }
        if (
            this.isFilterEnable(attributes) &&
            !isEmpty(attributes['filterCategory'])
        ) {
            let activeCategory = attributes['filterCategory'][0];
            if (
                typeof activeCategory !== 'undefined' &&
                !isEmpty(attributes['options'])
            ) {
                this.setState({ options: attributes['options'] }, () => {
                    this.setFilterCategory(activeCategory);
                });
            }
        }
    };

    setLocalOptions = options => {
        if (!isEmpty(options)) {
            this.setState({ options: options });
        }
    };

    handleOnGetQuery = offset => {
        const { onGetQuery, attributes } = this.props;
        if (
            !isEmpty(attributes) &&
            !isEmpty(attributes['data_source']) &&
            attributes['data_source']['type'] === 'remote'
        ) {
            if (typeof onGetQuery === 'function') {
                onGetQuery(attributes, offset);
            }
        } else {
            attributes['options'] = this.state.options;
            this.setState({});
        }
    };

    handleOnSearchQuery = (searchText, lookAhead) => {
        this.setLookupFilter(searchText);
        this.setLookupSearchReq();
        const { onSearchQuery, attributes } = this.props;
        const data_source = attributes['data_source'];
        if (!isEmpty(data_source) && data_source['type'] === 'remote') {
            if (typeof onSearchQuery === 'function') {
                onSearchQuery(attributes, searchText, 0, false);
            }
        } else {
            let options = [];
            if (searchText) {
                options = _.filter(this.state.options, item => {
                    let sItem =
                        item[attributes.labelKey]
                            .toString()
                            .toLowerCase()
                            .search(searchText.trim().toLowerCase()) > -1;
                    if (sItem) {
                        return item;
                    }
                });
            } else {
                options = this.state.options;
            }
            attributes['options'] = options;
        }

        if (searchText) {
            let obj = {
                category: attributes['labelKey'],
                categoryLabel: 'Search',
                value: searchText,
            };
            let categoryToValue = [];
            categoryToValue.push(obj);

            this.setState({
                searchModalVisible:
                    typeof lookAhead !== 'undefined' && lookAhead
                        ? true
                        : false,
                categoryToValue: categoryToValue,
                selectedFilter: categoryToValue,
            });
        }
    };

    handleOnFilterQuery = filter => {
        this.setLookupFilter(filter);
        const { onSearchQuery, attributes } = this.props;
        const data_source = attributes['data_source'];
        if (!isEmpty(data_source) && data_source['type'] === 'remote') {
            if (typeof onSearchQuery === 'function') {
                onSearchQuery(attributes, filter, 0, false);
            }
        } else {
            let updatedOptions = [];
            let preOptions = attributes['options'];
            _.map(filter, item => {
                let options = item['value'];
                let category = item['category'];

                options.map(option => {
                    let allMatchingOptions = [];
                    allMatchingOptions = _.filter(preOptions, item2 => {
                        if (option === item2[category]) {
                            return item2;
                        }
                    });

                    if (allMatchingOptions.length) {
                        updatedOptions = [
                            ...updatedOptions,
                            ...allMatchingOptions,
                        ];
                    }
                });
            });
            attributes['options'] = updatedOptions;
        }
        this.setState({
            searchText: '',
            barcodeSearchText:'',
            categoryToValue: filter,
            filterModalVisible: false,
            searchModalVisible: false,
            barcodeModalVisible: false,
            modalVisible: true,
            selectedFilter: filter
        });
    };

    statusOptionsFormatter = (options, type) => {
        let data = [];
        if (!isEmpty(options)) {
            for (let i = 0; i < options.length; i++) {
                let obj = { label: '', value: '', type: '' };
                if (typeof options[i] === 'string') {
                    obj['label'] = options[i];
                    obj['value'] = options[i];
                    obj['type'] = type;
                    data.push(obj);
                }
            }
        }

        return data;
    };

    setFilterCategory = item => {
        const categoryData = this.statusOptionsFormatter(
            item['options'],
            item['type']
        );
        this.setState({
            activeCategoryData: categoryData,
            activeCategory: item,
            filterData: categoryData,
        });
    };

    updateFilter = item => {
        let filterArr = this.state.filterArr;
        const { attributes } = this.props;
        if (item['selected'] && typeof filterArr !== 'undefined') {
            filterArr.push(item);
        } else {
            if (filterArr.length) {
                filterArr = _.filter(
                    filterArr,
                    row =>
                        row[attributes.labelKey] !== item[attributes.labelKey]
                );
            }
        }
        return filterArr;
    };

    mapCatagoryToValue = (category, item) => {
        let categoryToValue = this.state.categoryToValue;
            let index = _.findIndex(categoryToValue, {
                         category: category['name'],
                     });
            if (categoryToValue.length && index !== -1) {
                const index = _.findIndex(categoryToValue, {
                    category: category['name'],
                });
                if (index !== -1) {
                    const foundObj = categoryToValue[index];
                    let options = foundObj['value'];
                    if(options.includes(item['value'])){
                        options = _.filter(
                            options,
                            option => option !== item['value']
                        );
                    } else {
                        options.push(item['value']);
                    }
                    foundObj['value'] = options;
                    categoryToValue[index] = foundObj;
                } else {
                    categoryToValue.splice(index, 1);
                }
            } else {
                let activeCategoryObj = {
                  category: category["name"],
                  value: [item["value"]],
                  categoryLabel: category["label"],
                  type: category["type"],
                };
                categoryToValue.push(activeCategoryObj);
            }
        return categoryToValue;
    };

    applyFilterFunction = () => {
        const filter = _.filter(
            this.state.categoryToValue,
            sItem => sItem['categoryLabel'] !== 'Search'
        );
        this.handleOnFilterQuery(filter);
    };

    resetFilter = () => {
        let filterData = this.state.filterData;
        const { attributes } = this.props;
        filterData = _.map(filterData, option => {
            option['selected'] = false;
            return option;
        });
        const offset = !isEmpty(attributes['options'])
            ? attributes['options'].length
            : 0;
        this.handleOnGetQuery(offset);
        this.setState({ filterData: filterData });
    };

    handleReset = item => {
        const { attributes } = this.props;
        let categoryToValue = this.state.categoryToValue;
        let category = item['category'];
        let filterData = this.state.filterData;
        let filterArr = this.state.filterArr;

        categoryToValue = _.filter(categoryToValue, row => {
            let rowCategory = row['category'];
            if (rowCategory !== category) {
                return row;
            }
        });

        if (categoryToValue.length) {
            filterArr = _.filter(filterArr, row => {
                if (row['selected']) {
                    let index = _.findIndex(item['value'], option => {
                        return row[category] == option[option];
                    });
                    if (index === -1) {
                        return row;
                    }
                }
            });

            filterData = _.map(filterData, row => {
                let index = _.findIndex(item['value'], option => {
                    return row[category] == option[option];
                });
                if (row['selected'] && index !== -1) {
                    row['selected'] = false;
                    return row;
                }
                return row;
            });
        } else {
            filterArr = _.map(filterArr, row => (row['selected'] = false));
            filterData = _.map(filterData, row => (row['selected'] = false));
        }

        if (categoryToValue.length) {
            this.setState(
                {
                    filterArr: filterArr,
                    filterData: filterData,
                    categoryToValue: categoryToValue,
                    selectedFilter: categoryToValue
                },
                () => this.applyFilterFunction()
            );
        } else {
            this.setState(
                {
                    filterArr: filterArr,
                    filterData: filterData,
                    categoryToValue: categoryToValue,
                    searchText: '',
                    barcodeSearchText:'',
                    selectedFilter: categoryToValue
                },
                () => {
                    const offset = 0;
                    this.handleOnGetQuery(offset);
                }
            );
        }
    };

    toggleFilterSelect = item => {
        let filterData = this.state.filterData;
        item['selected'] =
            typeof item['selected'] !== 'undefined' ? !item['selected'] : true;
        const present = _.findIndex(filterData, `${item.name}`);
        if (present !== -1) {
            filterData[present] = item;
        }

        const filterArr = this.updateFilter(item);
        const categoryToValue = this.mapCatagoryToValue(
            this.state.activeCategory,
            item
        );
        this.setState({
            filterArr: filterArr,
            filterData: filterData,
            categoryToValue: categoryToValue,
        });
    };

    handleTextChange = searchText => {
        if (this.state.filterModalVisible) {
            let activeCategoryData = this.state.activeCategoryData;
            let filterData = [];
            filterData = _.filter(activeCategoryData, item => {
                let sItem = '';
                sItem =
                    item['label']
                        .toString()
                        .toLowerCase()
                        .search(searchText.trim().toLowerCase()) > -1;
                if (sItem) {
                    return item;
                }
            });
            if (searchText && filterData.length) {
                this.setState({
                    filterData: filterData,
                    searchText: searchText,
                });
            } else {
                this.setState({
                    filterData: activeCategoryData,
                    searchText: searchText,
                });
            }
        } else if (this.state.searchModalVisible) {
            this.setState({ searchText: searchText });
        }
    };

    setLookupSearchReq = () => {
        const { setLookupSearchReq, attributes } = this.props;
        const data_source = attributes["data_source"];
        if (!isEmpty(data_source) && data_source["type"] === "remote") {
          if (typeof setLookupSearchReq === "function") {
            setLookupSearchReq();
          }
        }
      };

    setLookupFilter = filter => {
        const { setLookupFilter, attributes } = this.props;
        const data_source = attributes['data_source'];
        if (!isEmpty(data_source) && data_source['type'] === 'remote') {
            if (typeof setLookupFilter === 'function') {
                setLookupFilter(filter, attributes);
            }
        }
    };

    toggleSearchModalVisible = () => {
        this.setState({
            searchModalVisible: !this.state.searchModalVisible,
            filterModalVisible: false,
            modalVisible: true,
            barcodeModalVisible: false,
            searchText: '',
            barcodeSearchText:'',
            categoryToValue: [],
        });
    };

    toggleBarcodeModalVisible = () => {
        this.setState({
            barcodeModalVisible: !this.state.barcodeModalVisible,
            searchModalVisible: false,
            filterModalVisible: false,
            modalVisible: true,
            searchText: '',
            barcodeSearchText:'',
            categoryToValue: [],
        });
    };

    onBarCodeRead = code => {
        const searchText = code && code.data ? code.data : null;
        if (!isEmpty(searchText)) {
          this.setLookupFilter(searchText);
          this.setLookupSearchReq();
          const { onSearchQuery, attributes } = this.props;
          const categoryToValue = [
            {
              category: attributes["barcodeKey"],
              categoryLabel: "Search",
              value: [searchText],
              type: "text",
            },
          ];
          const data_source = attributes["data_source"];
          if (!isEmpty(data_source) && data_source["type"] === "remote") {
            if (typeof onSearchQuery === "function") {
              onSearchQuery(attributes, categoryToValue, 0, true);
            }
          } else {
            let options = [];
            if (searchText) {
              options = _.filter(this.state.options, (item) => {
                let sItem =
                  item[attributes.labelKey]
                    .toString()
                    .toLowerCase()
                    .search(searchText.trim().toLowerCase()) > -1;
                if (sItem) {
                  return item;
                }
              });
            } else {
              options = this.state.options;
            }
            attributes["options"] = options;
          }
            this.setState({
              barcodeModalVisible: false,
              barcodeSearchText: searchText,
              categoryToValue,
            });
        } else {
          this.setState({
            barcodeModalVisible: false,
          });
        }
    };

    renderModalContent = () => {
        return (
          <View style={styles.modalContainer}>
            <RNCamera
              style={styles.modalPreview}
              flashMode={RNCamera.Constants.FlashMode.on}
              onBarCodeRead={this.onBarCodeRead}
              ref={(cam) => (this.camera = cam)}
            />
          </View>
        );
      };
    
    toggleFilterModalVisible = () => {
        if (this.state.filterModalVisible) {
            this.setState({
                filterModalVisible: false,
                searchModalVisible: false,
                barcodeModalVisible: false,
                categoryToValue: []
            });
        } else {
            const { attributes } = this.props;
            if (!isEmpty(attributes['filterCategory'])) {
                const activeCategory = attributes['filterCategory'][0];
                const categoryData = this.statusOptionsFormatter(
                    activeCategory['options'],
                    activeCategory['type']
                );
                this.setState({
                    activeCategoryData: categoryData,
                    activeCategory: activeCategory,
                    filterData: categoryData,
                    searchModalVisible: false,
                    barcodeModalVisible: false,
                    filterModalVisible: true,
                });
            }
        }
    };

    toggleModalVisible = () => {
        if (this.state.modalVisible) {
            const { attributes } = this.props;
            const data_source = attributes['data_source'];
            if (!isEmpty(data_source) && data_source['type'] !== 'remote') {
                attributes['options'] = this.state.options.length
                    ? this.state.options
                    : attributes['options'];
            }
            if (this.timeout) clearTimeout(this.timeout);
            this.setState({
                modalVisible: false,
                filterModalVisible: false,
                searchModalVisible: false,
                barcodeModalVisible: false,
                categoryToValue: [],
                activeCategory: null,
                searchText: '',
                barcodeSearchText:'',
            });
        } else {
            this.setState(
                {
                    filterModalVisible: false,
                    searchModalVisible: false,
                    barcodeModalVisible: false,
                    modalVisible: true,
                    searchText: '',
                    barcodeSearchText:'',
                    categoryToValue: [],
                },
                () => this.setInitialData()
            );
        }
    };

    handlePullToRefresh = () => {
        const { attributes, pullToRefresh } = this.props;
        const searchText = this.state.searchText;
        const categoryToValue = this.state.categoryToValue;
        // based on parameter call filter, search and get
        if (
            !isEmpty(attributes) &&
            !isEmpty(attributes['data_source']) &&
            attributes['data_source']['type'] === 'remote'
        ) {
                const filter = searchText
                ? searchText
                : categoryToValue.length > 0
                ? categoryToValue
                : null;
            const offset = Array.isArray(attributes['options'])
                ? attributes['options'].length
                : 0;
            if (pullToRefresh && typeof pullToRefresh === 'function') {
                if (filter && filter !== null) {
                    pullToRefresh(
                      attributes,
                      filter,
                      offset,
                      !isEmpty(this.state.barcodeSearchText)
                        ? "barcode"
                        : "search/filter"
                    );
                } else {
                    pullToRefresh(attributes, '', offset, 'get');
                }
            }
        }
    };

    onEndReached = () => {
        const { attributes, onSearchQuery } = this.props;
        const searchText = this.state.searchText;
        const categoryToValue = this.state.categoryToValue;
        // based on parameter call filter, search and get
        if (
            !isEmpty(attributes) &&
            !isEmpty(attributes['data_source']) &&
            attributes['data_source']['type'] === 'remote'
        ) {
            const filter = searchText
              ? searchText
              : categoryToValue.length > 0
              ? categoryToValue
              : null;
            const offset = Array.isArray(attributes['options'])
                ? attributes['options'].length
                : 0;
            if (filter !== null && typeof onSearchQuery === 'function') {
                onSearchQuery(
                  attributes,
                  filter,
                  offset,
                  !isEmpty(this.state.barcodeSearchText) ? true : false
                );
            } else {
                this.handleOnGetQuery(offset);
            }
        }
    };

    toggleSelect = value => {
        const { attributes } = this.props;
        let newSelected = attributes.multiple ? attributes.value : value;
        if (attributes.multiple) {
            const index = attributes.objectType
                ? newSelected.findIndex(
                      option =>
                          option[attributes.primaryKey] ===
                          value[attributes.primaryKey]
                  )
                : newSelected.indexOf(value);
            if (index === -1) {
                newSelected.push(value);
            } else {
                newSelected.splice(index, 1);
            }
        }

        if (this.state.searchModalVisible) {
            this.setState(
                {
                    searchModalVisible: attributes.multiple
                        ? this.state.searchModalVisible
                        : false,
                    modalVisible: attributes.multiple
                        ? this.state.modalVisible
                        : false,
                },
                () => this.props.updateValue(attributes.name, value)
            );
        } else {
            this.setState(
                {
                    modalVisible: attributes.multiple
                        ? this.state.modalVisible
                        : false,
                },
                () => this.props.updateValue(attributes.name, newSelected)
            );
        }
    };

    renderlookupIcon = () => {
        return (
            <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => this.toggleModalVisible()}
            >
                <ArrowForwardIcon size={"6"} color={'#41E1FD'}/>
            </TouchableOpacity>
        );
    };

    isFilterEnable = attributes => {
        if (!isEmpty(attributes) && !isEmpty(attributes['additional'])) {
            const { filterEnable } = attributes['additional'];
            const filterCategory = attributes['filterCategory'];

            if (
                !isEmpty(filterCategory) &&
                (typeof filterEnable !== 'undefined' && filterEnable)
            ) {
                return true;
            }
        }
        return false;
    };

    isSearchEnable = attributes => {
        if (!isEmpty(attributes) && !isEmpty(attributes['additional'])) {
            const { searchEnable } = attributes['additional'];
            if (typeof searchEnable !== 'undefined' && searchEnable) {
                return true;
            }
        }
        return false;
    };

    isBarcodeEnable = attributes => {
        if (!isEmpty(attributes) && typeof attributes['barcodeKey'] !== 'undefined' && attributes['barcodeKey']) {
            return true;
        }
        return false;
    };

    isPullToRefreshEnable = attributes => {
        if (
            !isEmpty(attributes) &&
            !isEmpty(attributes['data_source']) &&
            attributes['data_source']['type'] === 'remote'
        ) {
            const { pullToRefresh } = this.props;
            if (typeof pullToRefresh !== 'undefined' && pullToRefresh) {
                return true;
            }
        }
        return false;
    };

    getLabel = () => {
        const { attributes } = this.props;
        let label = 'None';
        if (!isEmpty(attributes['value'])) {
            if (attributes.multiple) {
                const labelKeyArr = attributes['value'].map(obj => {
                    const labelKey = attributes.objectType
                        ? obj[attributes.labelKey]
                        : obj;
                    return labelKey;
                });
                if (labelKeyArr.length) {
                    label = ` ${
                        labelKeyArr.length
                    } | ${labelKeyArr.toString()}`;
                }
            } else {
                label = attributes.objectType
                    ? attributes['value'][attributes.labelKey]
                    : attributes['value'];
            }
        }
        return label;
    };

    renderComponent = () => {
        const { theme, attributes } = this.props;
        const search = this.state.searchModalVisible;
        const filter = this.state.filterModalVisible;

        if (search) {
            return (
                <SearchComponent
                    searchModalVisible={this.state.searchModalVisible}
                    attributes={attributes}
                    theme={theme}
                    toggleSearchModalVisible={this.toggleSearchModalVisible}
                    handleOnSearchQuery={this.handleOnSearchQuery}
                    searchText={this.state.searchText}
                    toggleSelect={this.toggleSelect}
                    handleTextChange={this.handleTextChange}
                />
            );
        }
        if (filter) {
            return (
                <FilterComponent
                    filterModalVisible={this.state.filterModalVisible}
                    theme={theme}
                    attributes={attributes}
                    filterData={this.state.filterData}
                    activeCategory={this.state.activeCategory}
                    toggleFilterModalVisible={this.toggleFilterModalVisible}
                    handleTextChange={this.handleTextChange}
                    applyFilterFunction={this.applyFilterFunction}
                    setFilterCategory={this.setFilterCategory}
                    filterFunction={this.toggleFilterSelect}
                    resetFilter={this.resetFilter}
                    categoryToValue={this.state.categoryToValue}
                />
            );
        }
    };

    onClickInlineCreationButton = () => {
        this.toggleModalVisible();
        this.props.onAddLookup(this.props);
    }

    render() {
        const { theme, attributes, ErrorComponent, lookupSearchReq } = this.props;
        return (
          <View style={styles.container}>
            <View style={[styles.inputLabelWrapper, { width: "95%" }]}>
              <TouchableOpacity
                style={[styles.inputLabel]}
                error={
                  theme.changeTextInputColorOnError ? attributes.error : null
                }
                onPress={() => this.toggleModalVisible()}
              >
                {attributes["required"] && (
                  <StarIcon required={attributes["required"]} />
                )}
                <View
                  style={[styles.labelTextWrapper, { flexDirection: "row" }]}
                >
                  <Text
                    style={[styles.labelText]}
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                  >
                    {attributes.label}
                  </Text>
                </View>
                <View style={styles.valueWrapper}>
                  <Text
                    style={styles.inputText}
                    numberOfLines={2}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                  >
                    {this.getLabel()}
                  </Text>
                </View>
                {this.renderlookupIcon()}
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
                onRequestClose={() => this.toggleModalVisible()}
              >
                {this.state.searchModalVisible ||
                this.state.filterModalVisible ? (
                  this.renderComponent()
                ) : (
                  <LookupComponent
                    modalVisible={this.state.modalVisible}
                    theme={theme}
                    attributes={attributes}
                    toggleSelect={this.toggleSelect}
                    onEndReached={this.onEndReached}
                    toggleModalVisible={this.toggleModalVisible}
                    toggleSearchModalVisible={this.toggleSearchModalVisible}
                    toggleFilterModalVisible={this.toggleFilterModalVisible}
                    toggleBarcodeModalVisible={this.toggleBarcodeModalVisible}
                    searchEnable={this.isSearchEnable(attributes)}
                    filterEnable={this.isFilterEnable(attributes)}
                    barcodeEnable={this.isBarcodeEnable(attributes)}
                    filter={this.state.categoryToValue}
                    selectedFilter={this.state.selectedFilter}
                    handleReset={this.handleReset}
                    activeCategory={this.state.activeCategory}
                    handlePullToRefresh={this.handlePullToRefresh}
                    loading={
                      typeof this.props.loading !== "undefined"
                        ? this.props.loading
                        : this.state.loading
                    }
                    pullToRefreshEnable={this.isPullToRefreshEnable(attributes)}
                    lookupSearchReq={lookupSearchReq}
                    searchText1={
                      !isEmpty(this.state.barcodeSearchText)
                        ? this.state.barcodeSearchText
                        : this.state.searchText
                    }
                    hideInlineCreation={
                      !isEmpty(attributes) &&
                      !isEmpty(attributes["additional"]) &&
                      attributes["additional"]["hide_inline_creation"]
                    }
                    onAddLookup={this.props.onAddLookup}
                    onClickInlineCreationButton={this.onClickInlineCreationButton}
                  />
                )}
              </Modal>
            }
            {this.state.barcodeModalVisible && (
              <Modal
                isVisible={this.state.barcodeModalVisible}
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => this.toggleBarcodeModalVisible()}
                onPressOut={() => this.toggleBarcodeModalVisible()}
              >
                {this.renderModalContent()}
              </Modal>
            )}
          </View>
        );
    }
}
