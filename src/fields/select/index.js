import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal,TouchableOpacity } from "react-native";
const _ = require('lodash');
import { isEmpty } from '../../utils/validators';
import {
    View,
    Text,
    Container,
    Header,
    Content,
    ListItem,
    CheckBox,
    Left,
    Right,
    Icon,
    Body,
    Title,
    Button,
    Footer
} from "native-base";

import StarIcon from "../../components/starIcon";
import styles from "./styles";

export default class SelectField extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            activeCategoryData:[],
            activeCategory: null,
            filterData: [],
            newSelected: null,
            options: [],
        };
    }

    componentDidMount() {
        const { attributes } = this.props;
        if (!isEmpty(attributes) && !isEmpty(attributes['data_source'])) {
            const { type } = attributes['data_source'];
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

    handleOnGetQuery = offset => {
        const { onGetQuery, attributes } = this.props;
        if (!isEmpty(attributes) && !isEmpty(attributes['data_source']) && attributes['data_source']['type']=== 'remote') {
            if (typeof onGetQuery === 'function') {
                onGetQuery(attributes, offset);
            }
        } else {
            attributes['options'] = this.state.options;
            this.setState({});
        }
    };

    setLocalOptions = options => {
        if (!isEmpty(options)) {
            this.setState({ options: options });
        }
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

    handleAddPressed = ()=>{
        const {attributes,updateValue} = this.props;
        const newSelected = this.state.newSelected;
        if(!isEmpty(newSelected) && typeof updateValue === 'function'){
            updateValue(attributes.name, newSelected)
        }
        this.setState({ modalVisible:false})
    }

    toggleModalVisible() {
        if(!this.state.modalVisible){
            const attributes = this.props.attributes;
            if(!isEmpty(attributes) && !isEmpty(attributes['value'])){
                this.setState({
                    newSelected: attributes['value']
                })
            }
        }
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    }

    toggleSelect(value) {
        const attributes = this.props.attributes;
        let newSelected = attributes.multiple ? attributes.value : value;
        if (attributes.multiple) {
            newSelected =  Array.isArray(newSelected)? newSelected: [];
            const index = attributes.objectType ? newSelected.findIndex(option =>
                option[attributes.primaryKey] === value[attributes.primaryKey]
            ) : newSelected.indexOf(value);
            if (index === -1) {
                newSelected.push(value);
            } else {
                newSelected.splice(index, 1);
            }
        }
        this.setState({
            modalVisible: attributes.multiple ? this.state.modalVisible : false,
            newSelected: newSelected,
        },() => this.props.updateValue(this.props.attributes.name, newSelected));

    }

    getLabel =()=>{
        const { attributes } = this.props;
        let label = "None"
        if(!isEmpty(attributes['value'])){
            if(attributes.multiple){
                const labelKeyArr = attributes['value'].map(obj=>{
                    const labelKey = attributes.objectType ? obj[attributes.labelKey]
                    : obj;
                    return labelKey;
                })
                if(labelKeyArr.length){
                    label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}` ;
                }
            }else{
                label = attributes.objectType?attributes['value'][attributes.labelKey]
                : attributes['value'];
            }
        }
        return label;
    }

    renderIcon = () => {
        return (
            <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => this.toggleModalVisible()}
            >
                <Icon
                    name="ios-arrow-forward"
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        );
    };

    renderComponent =()=>{
        const { theme, attributes } = this.props;
        return(
            <Container style={{ flex: 1 }}>
                <Header style={[theme.header]} androidStatusBarColor='#c8c8c8'>
                    <Left>
                        <Button transparent onPress={() => this.toggleModalVisible()}>
                            <Icon name="arrow-back" style={theme.headerLeftIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={theme.headerText}>{attributes.label || "Select"}</Title>
                    </Body>
                    <Right />
                </Header>

                <Content>
                    {
                        !isEmpty(attributes['options']) && attributes.options.map((item, index) => {
                            let isSelected = false;
                            if (attributes.multiple) {
                                isSelected = attributes.objectType ?
                                    attributes.value && attributes.value.findIndex(option =>
                                        option[attributes.primaryKey] === item[attributes.primaryKey]
                                    ) !== -1 : (attributes.value && attributes.value.indexOf(item) !== -1);
                            }
                            return (
                                <ListItem
                                    key={index}
                                    onPress={() => this.toggleSelect(item)}>
                                    {attributes.multiple &&
                                        <CheckBox
                                            onPress={() => this.toggleSelect(item)}
                                            checked={isSelected}
                                        />
                                    }
                                    <Body>
                                        <Text style={{ paddingHorizontal: 5 }}>
                                            {attributes.objectType ? item[attributes.labelKey] : item}
                                        </Text>
                                    </Body>
                                </ListItem>);
                        })
                    }
                </Content>
                { attributes && attributes['multiple']?
                    <Footer style={styles.button}>
                        <TouchableOpacity style={styles.button} onPress={() => this.handleAddPressed()}>
                            <Text style={styles.buttonText}>{'Add'} </Text>
                        </TouchableOpacity>
                    </Footer>
                    : null
                }
            </Container>
        )

    }
    
    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View  style = {styles.container}>
                <View style = {styles.inputLabelWrapper}>
                    <TouchableOpacity
                        style={[styles.inputLabel]}
                        error={
                            theme.changeTextInputColorOnError
                                ? attributes.error
                                : null
                        }
                        onPress={() => this.toggleModalVisible()}
                    >
                        <View style = {[styles.labelTextWrapper,{flexDirection:'row'}]}>
                            {attributes['required'] && <StarIcon required={attributes['required']} />}
                            <Text 
                                style={[styles.labelText]} 
                                numberOfLines={2}
                                adjustsFontSizeToFit={true}
                                minimumFontScale={0.8}
                                >{attributes.label}</Text>
                        </View>
                        <View style={styles.valueWrapper}>
                            <Text 
                                style={styles.inputText} 
                                numberOfLines={2}
                                adjustsFontSizeToFit={true}
                                minimumFontScale={0.8}
                                >{this.getLabel()} </Text>
                        </View>
                        {this.renderIcon()}
                    </TouchableOpacity>
                </View>

                { this.state.modalVisible && (
                    <Modal
                        visible={this.state.modalVisible}
                        animationType="none"
                        onRequestClose={() => this.toggleModalVisible()}
                        transparent ={true}>
                        {this.renderComponent()}
                    </Modal>)
                    
                }
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}