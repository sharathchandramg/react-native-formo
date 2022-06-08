import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, TouchableOpacity, ScrollView } from 'react-native';
import _ from 'lodash';
import { isEmpty } from '../../utils/validators';
import {
    View,
    Text,
    ArrowBackIcon,
    ArrowForwardIcon,
    SearchIcon,
    Checkbox
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import LinearGradientHeader from './../../components/headers/linearGradientHeader';
import SearchHeader from '../../components/headers/searchHeader';
import StarIcon from "../../components/starIcon";

export default class UserDirectoryField extends Component {
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
            searchModalVisible: false,
            options: [],
            searchText: '',
            newSelected: null,
        };
    }

    componentDidMount() {
        this.setInitialData();
    }

    setInitialData = () => {
        const { attributes } = this.props;
        if (!isEmpty(attributes) && attributes['type'].match(/user_directory/)) {
            this.handleOnGetQuery();
            this.setLocalOptions(attributes['options']);
        } else {
            this.setLocalOptions(attributes['options']);
        }
    };

    handleOnGetQuery = () => {
        const { onGetQuery, attributes } = this.props;
        if (!isEmpty(attributes) && attributes['type'].match(/user_directory/)) {
            if (typeof onGetQuery === 'function') {
                onGetQuery(attributes);
            }
        }
    };

    setLocalOptions = options => {
        if (!isEmpty(options)) {
            this.setState({ options: options });
        }
    };

    handleAddPressed = () => {
        const { attributes, updateValue } = this.props;
        const newSelected = this.state.newSelected;
        if (!isEmpty(newSelected) && typeof updateValue === 'function') {
            updateValue(attributes.name, newSelected);
        }
        this.setState({ modalVisible: false, searchModalVisible: false });
    };

    toggleSearchModalVisible = () => {
        const { attributes } = this.props;
        this.setState({
            searchModalVisible: !this.state.searchModalVisible,
            modalVisible: true,
            searchText: '',
            options: attributes['options'],
        });
    };

    toggleModalVisible() {
        const attributes = this.props.attributes;
        if (!this.state.modalVisible) {
            if (!isEmpty(attributes) && !isEmpty(attributes['value'])) {
                this.setState(
                    {
                        newSelected: attributes['value'],
                        modalVisible: !this.state.modalVisible,
                        searchText: '',
                    },
                    () => this.setInitialData()
                );
            } else {
                this.setState(
                    {
                        modalVisible: !this.state.modalVisible,
                        searchText: '',
                    },
                    () => this.setInitialData()
                );
            }
        } else {
            this.setState(
                {
                    modalVisible: !this.state.modalVisible,
                    searchText: '',
                },
                () => this.setInitialData()
            );
        }
    }

    toggleSelect(value) {
        const attributes = this.props.attributes;
        if (!isEmpty(value) && !isEmpty(attributes)) {
            const pk = attributes.primaryKey;
            const lk = attributes.labelKey;
            const obType = attributes.objectType;
            let valueObj = {...value};
            if (attributes.multiple) {
                let newSelected = attributes['value'];
                newSelected = Array.isArray(newSelected) ? newSelected : [];
                const index = obType
                    ? newSelected.findIndex(
                          option =>
                              option &&
                              option[pk] === value[pk]
                      )
                    : newSelected.indexOf(value);
                if (index === -1) {
                    newSelected.push(valueObj);
                } else {
                    newSelected.splice(index, 1);
                }

                this.setState(
                    {
                        modalVisible: attributes.multiple
                            ? this.state.modalVisible
                            : false,
                        newSelected: newSelected,
                        searchModalVisible: false,
                    },
                    () =>
                        this.props.updateValue(
                            this.props.attributes.name,
                            newSelected
                        )
                );
            } else {
                this.setState(
                    {
                        modalVisible: false,
                        searchModalVisible: false,
                    },
                    () =>
                        this.props.updateValue(this.props.attributes.name, valueObj)
                );
            }
        }
    }

    handleTextChange = searchText => {
        let options = [];
        const { attributes } = this.props;
        if (searchText) {
            options = _.filter(attributes.options, item => {
                let userAliasSearch = !isEmpty(item['user_alias'])?item['user_alias']
                .toString()
                .toLowerCase()
                .search(searchText.trim().toLowerCase()) > -1:false;

                let sItem =
                    item[attributes.labelKey]
                        .toString()
                        .toLowerCase()
                        .search(searchText.trim().toLowerCase()) > -1 || userAliasSearch;
                if (sItem) {
                    return item;
                }
            });
        } else {
            options = attributes.options;
        }
        this.setState({
            searchText: searchText,
            options: options,
        });
    };

    handleOnSearchQuery = searchText => {
        let options = [];
        const { attributes } = this.props;
        if (searchText) {
            options = _.filter(attributes.options, item => {
                let userAliasSearch = !isEmpty(item['user_alias'])?item['user_alias']
                .toString()
                .toLowerCase()
                .search(searchText.trim().toLowerCase()) > -1:false;
                let sItem =
                    item[attributes.labelKey]
                        .toString()
                        .toLowerCase()
                        .search(searchText.trim().toLowerCase()) > -1 || userAliasSearch;
                if (sItem) {
                    return item;
                }
            });
        } else {
            options = this.state.options;
        }

        this.setState({
            searchModalVisible: false,
            searchText: searchText,
            options: options,
        });
    };

    handleReset = () => {
        const { attributes } = this.props;
        this.setState({
            searchText: '',
            options: attributes['options'],
        });
    };

    getLabel = () => {
        const { attributes } = this.props;
        let label = 'None';
        if (!isEmpty(attributes['value'])) {
            const value = attributes['value'];
            const lk = attributes['labelKey'];
            const obType = attributes['objectType'];

            if (attributes.multiple) {
                const labelKeyArr = value.map(option => {
                    const labelKey = obType
                        ? option && option[lk]
                        : option;
                    return labelKey;
                });
                if (labelKeyArr.length) {
                    label = ` ${
                        labelKeyArr.length
                    } | ${labelKeyArr.toString()}`;
                }
            } else {
                label = obType
                    ? value && value[lk]
                    : value;
            }
        }
        return label;
    };

    renderIcon = () => {
        return (
            <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => this.toggleModalVisible()}
            >
                <ArrowForwardIcon size={"6"} color={'#41E1FD'}/>
            </TouchableOpacity>
        );
    };

    displayLabelKey = item => {
        const { attributes } = this.props;
        let label = '';
        if (attributes['objectType'] && !isEmpty(item)) {
            const labelKey = item[attributes.labelKey];
            const userAlias =
                typeof item['user_alias'] !== 'undefined'
                    ? item['user_alias']
                    : '';
            label = userAlias
                ? `${labelKey}(${userAlias})`
                : `${labelKey} (N/A)`;
        } else {
            label = item;
        }
        return label;
    };

    renderOptionList = () => {
        const { attributes } = this.props;
        let list = [];

        if (!isEmpty(this.state['options']) && this.state['options'].length) {
            list = this.state.options.map((item, index) => {
                let isSelected = false;
                if (!isEmpty(item)) {
                    if (attributes.multiple) {
                        isSelected = attributes.objectType
                            ? attributes.value &&
                              attributes.value.findIndex(
                                  option =>
                                      option &&
                                      option[
                                          attributes.primaryKey
                                      ] === item[attributes.primaryKey]
                              ) !== -1
                            : attributes.value &&
                              attributes.value.indexOf(item) !== -1;
                    }
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => this.toggleSelect(item)}
                        style={{
                          height: 50,
                          marginHorizontal: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: "rgb(230, 230, 230)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {attributes.multiple && (
                          <Checkbox
                            onPress={() => this.toggleSelect(item)}
                            isChecked={isSelected}
                            colorScheme={"rgb(0,151,235)"}
                            accessibilityLabel={this.displayLabelKey(item)}
                          />
                        )}
                        <View>
                          <Text
                            style={{
                              paddingHorizontal: 5,
                            }}
                          >
                            {this.displayLabelKey(item)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                }
            });
        }
        return list.length ? (
          list
        ) : (
          <View style={styles.noDataWrapper}>
            <Text style={styles.nodataText}>No records found</Text>
          </View>
        );
    };

    renderHeader=()=>{
        const { theme, attributes } = this.props;
        return (
          <View style={styles.headerWrapper}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerLeft}
                onPress={() => this.toggleModalVisible()}
              >
                <ArrowBackIcon size={"6"} color={"rgb(0,151,235)"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerCenter}>
                <Text style={theme.headerText}>
                  {attributes.label || "Select"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerCenterIconView}
                onPress={() => this.toggleSearchModalVisible()}
              >
                <SearchIcon size={"6"} color={"rgb(0,151,235)"} />
              </TouchableOpacity>
            </View>
            <LinearGradientHeader />
          </View>
        );
    }

    renderFooter = () => {
        const { attributes } = this.props;
        if (attributes && attributes['multiple']) {
            return (
              <View style={styles.footerWrapper}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.handleAddPressed()}
                >
                  <Text style={styles.buttonText}>{"Add"} </Text>
                </TouchableOpacity>
              </View>
            );
        }
        return null;
    };

    renderSearchText = () => {
        if (this.state.searchText) {
            return (
                <View style={styles.selectedContainer}>
                    <TouchableOpacity
                        style={styles.selectedStatusOuter}
                        onPress={() => this.handleReset()}
                    >
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={styles.selectedText}
                        >
                            {this.state.searchText}
                        </Text>
                        <TouchableOpacity
                            style={styles.removeFilterIcon}
                            onPress={() => this.handleReset()}
                        >
                            <Icon
                                name={'times-circle'}
                                style={{ fontSize: 14, color: 'white' }}
                                type="FontAwesome"
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    renderComponent = () => {
        if (this.state.searchModalVisible) {
            return (
                <View style={styles.modalContent}>
                    <SearchHeader
                        toggleSearchModalVisible={this.toggleSearchModalVisible}
                        handleOnSearchQuery={this.handleOnSearchQuery}
                        handleTextChange={this.handleTextChange}
                        searchText={this.state.searchText}
                    />
                    <ScrollView style={{ flex: 1 }}>
                        <View>{this.renderOptionList()}</View>
                    </ScrollView>
                </View>
            );
        } else {
            return (
              <View style={styles.modalContent}>
                {this.renderHeader()}
                {this.renderSearchText()}
                <ScrollView style={{ flex: 1 }}>
                  <View>{this.renderOptionList()}</View>
                </ScrollView>
                {this.renderFooter()}
              </View>
            );
        }
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View style={styles.container}>
                <View style={[styles.inputLabelWrapper, { width: '95%' }]}>
                    <TouchableOpacity
                        style={[styles.inputLabel]}
                        error={
                            theme.changeTextInputColorOnError
                                ? attributes.error
                                : null
                        }
                        onPress={() => this.toggleModalVisible()}
                    >
                        {attributes['required'] && <StarIcon required={attributes['required']} />}
                        <View style={[styles.labelTextWrapper,{flexDirection:'row'}]}>
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
                        {this.renderIcon()}
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={this.state.modalVisible}
                    animationType="none"
                    onRequestClose={() => this.toggleModalVisible()}
                    transparent={true}
                >
                    {this.renderComponent()}
                </Modal>

                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
