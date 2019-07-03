import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Form0 from './../../index';
const _ = require('lodash');
import { isEmpty } from '../../utils/validators';

import { View, Text, Icon } from 'native-base';

import styles from './styles';
import SearchComponent from '../../components/search';
import LookupComponent from '../../components/lookup';
import FilterComponent from '../../components/filter';

export default class LookupField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        onGetQuery: PropTypes.func,
        onSearchQuery: PropTypes.func,
    };

    constructor(props) {
        super(props);
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
        };
    }

    componentDidMount() {
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
    }

    setLocalOptions = options => {
        if (!isEmpty(options)) {
            this.setState({ options: options });
        }
    };

    handleOnGetQuery = offset => {
        const { onGetQuery, attributes } = this.props;
        if (!isEmpty(attributes) && !isEmpty(attributes['data_source'])) {
            const { type, key, url } = attributes['data_source'];
            if (!isEmpty(type) && type === 'remote') {
                if (typeof onGetQuery === 'function') {
                    onGetQuery(attributes, offset);
                }
            } else {
                attributes['options'] = this.state.options;
                this.setState({});
            }
        } else {
            attributes['options'] = this.state.options;
            this.setState({});
        }
    };

    handleOnSearchQuery = searchText => {
        const { onSearchQuery, attributes } = this.props;
        if (!isEmpty(attributes) && !isEmpty(attributes['data_source'])) {
            const { type, key, url } = attributes['data_source'];
            if (!isEmpty(type) && type === 'remote') {
                if (typeof onSearchQuery === 'function') {
                    onSearchQuery(attributes, searchText);
                }
            } else {
                let options = [];
                if (searchText) {
                    options = _.filter(attributes['options'], item => {
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
        } else {
            let options = [];
            if (searchText) {
                options = _.filter(attributes['options'], item => {
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
                searchModalVisible: false,
                categoryToValue: categoryToValue,
            });
        }
    };

    handleOnFilterQuery = filter => {
        const { onSearchQuery, attributes } = this.props;
        const data_source = attributes['data_source'];

        if (!isEmpty(data_source) && data_source['type'] === 'remote') {
            if (typeof onSearchQuery === 'function') {
                onSearchQuery(attributes, filter);
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
            categoryToValue: filter,
            filterModalVisible: false,
            searchModalVisible: false,
            modalVisible: true,
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
        if (typeof item['selected'] !== 'undefined' && item['selected']) {
            let activeCategoryObj = {
                category: category['name'],
                value: [item['value']],
                categoryLabel: category['label'],
            };
            let index = _.findIndex(categoryToValue, {
                category: category['name'],
            });
            if (index !== -1) {
                let foundObj = categoryToValue[index];
                let options = foundObj['value'];
                let updatedOptions = [...options];
                if (options.length) {
                    options.map(option => {
                        if (!_.isEqual(option, item['value'])) {
                            updatedOptions.push(item['value']);
                        }
                    });
                } else {
                    updatedOptions.push(item['value']);
                }
                foundObj['value'] = [...updatedOptions];
                categoryToValue[index] = foundObj;
            } else {
                categoryToValue.push(activeCategoryObj);
            }
            return categoryToValue;
        } else {
            if (categoryToValue.length) {
                categoryToValue = _.filter(categoryToValue, row => {
                    let options = row['value'];
                    options = _.filter(
                        options,
                        option => option !== item['value']
                    );
                    row['value'] = options;
                    return row;
                });
            }
        }
        return categoryToValue;
    };

    filterFunction = item => {
        let filterData = this.toggleFilterSelect(item);
        let filterArr = this.updateFilter(item);
        let categoryToValue = this.mapCatagoryToValue(
            this.state.activeCategory,
            item
        );
        this.setState({
            filterArr: filterArr,
            filterData: filterData,
            categoryToValue: categoryToValue,
        });
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
                },
                () => {
                    const offset =
                        typeof attributes['options'] !== 'undefined' &&
                        Array.isArray(attributes['options'])
                            ? attributes['options'].length
                            : 0;
                    this.handleOnGetQuery(offset);
                }
            );
        }
    };

    toggleFilterSelect = item => {
        let filterData = this.state.filterData;
        item['selected'] =
            typeof item['selected'] !== 'undefined' ? !item['selected'] : true;
        let present = _.findIndex(filterData, `${item.name}`);
        if (present !== -1) {
            filterData[present] = item;
        }
        return filterData;
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
        } else {
            this.setState({ searchText: searchText });
        }
    };

    toggleSearchModalVisible = () => {
        this.setState({
            searchModalVisible: !this.state.searchModalVisible,
            filterModalVisible: false,
            modalVisible: true,
        });
    };

    toggleFilterModalVisible = () => {
        if (this.state.filterModalVisible) {
            this.setState({
                filterModalVisible: false,
                searchModalVisible: false,
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
                    filterModalVisible: true,
                });
            }
        }
    };

    toggleModalVisible = () => {
        if (this.state.modalVisible) {
            this.setState({
                modalVisible: false,
                filterModalVisible: false,
                searchModalVisible: false,
                categoryToValue: [],
                activeCategory: null,
                searchText: '',
            });
        } else {
            this.setState({
                filterModalVisible: false,
                searchModalVisible: false,
                modalVisible: true,
            });
        }
    };

    onEndReached = () => {
        const { attributes } = this.props;
        const searchText = this.state.searchText;
        const categoryToValue = this.state.categoryToValue;
        // based on parameter call filter, search and get
        if (!isEmpty(attributes) && !isEmpty(attributes['data_source'])) {
            if (searchText) {
                this.handleOnSearchQuery(searchText);
            } else if (!isEmpty(categoryToValue)) {
                this.handleOnFilterQuery(categoryToValue);
            } else {
                const offset = attributes['options']
                    ? attributes['options'].length
                    : 0;
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
                <Icon name="ios-arrow-forward" style={styles.iconStyle} />
            </TouchableOpacity>
        );
    };

    getLookupData = value => {
        let attributes = this.props.attributes;
        let options =
            typeof attributes.options !== 'undefined'
                ? attributes.options
                : null;
        let data = null;
        if (options !== null && value !== null) {
            let primaryKey = value[attributes.primaryKey];
            data = options.find(
                item => item[attributes.primaryKey] === primaryKey
            );
            return data;
        }
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
                    filterFunction={this.filterFunction}
                    resetFilter={this.resetFilter}
                />
            );
        }
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        let value =
            typeof attributes.value !== 'undefined' && attributes.value !== null
                ? attributes.value
                : null;
        let fields =
            typeof attributes.fields !== 'undefined' &&
            attributes.fields !== null
                ? attributes.fields
                : [];
        let data = value !== null ? this.getLookupData(value) : {};
        return (
            <View style={styles.container}>
                <View style={styles.inputLabelWrapper}>
                    <TouchableOpacity
                        style={[styles.inputLabel]}
                        error={
                            theme.changeTextInputColorOnError
                                ? attributes.error
                                : null
                        }
                        onPress={() => this.toggleModalVisible()}
                    >
                        <View style={styles.labelTextWrapper}>
                            <Text style={[styles.labelText]}>
                                {attributes.label}
                            </Text>
                        </View>
                        {this.renderlookupIcon()}
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
                <View style={{ flex: 1, width: '100%', marginHorizontal: -5 }}>
                    <Form0
                        ref={c => {
                            this.lookup = c;
                        }}
                        fields={fields}
                        formData={data}
                    />
                </View>
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
                        searchEnable={this.isSearchEnable(attributes)}
                        filterEnable={this.isFilterEnable(attributes)}
                        filter={this.state.categoryToValue}
                        handleReset={this.handleReset}
                        activeCategory={this.state.activeCategory}
                    />
                )}
            </View>
        );
    }
}
