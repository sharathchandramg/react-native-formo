import PropTypes from "prop-types";
import React, { Component } from "react";
import {TouchableOpacity } from "react-native";
import {
    View,
    Text,
    Icon,
} from "native-base";
import styles from "./styles"

import Table from "../../components/table";


export default class CheckList extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state={
            modalVisible:false,
        }
    }

    toggleModal = () => {
        if (this.state.modalVisible) {
            this.setState({
                modalVisible: false,
            });
        } else {
            this.setState({
                modalVisible: true,
            });
        }
    };

    getLabel =(value)=>{
        let label = "None"
        if(typeof value !=='undefined' && value && Object.keys(value).length){
            return value.label?value.label:'None';
        }
        return label;
    }

    renderChecklistIcon = () => {
        return (
            <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => this.toggleModal()}
            >
                <Icon
                    name="ios-arrow-forward"
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        );
    };
    
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
                        onPress={() => this.toggleModal()}
                    >
                        <View style = {styles.labelTextWrapper}>
                            <Text style={[styles.labelText]} numberOfLines={2}>{attributes.label}</Text>
                        </View>
                        <View style={styles.valueWrapper}>
                            <Text style={styles.inputText} numberOfLines={2}>{this.getLabel(attributes.value)} </Text>
                        </View>
                        {this.renderChecklistIcon()}
                    </TouchableOpacity>
                </View>
                    {this.state.modalVisible ? 
                        <Table 
                            modalVisible={this.state.modalVisible}
                            theme={theme}
                            attributes={attributes}
                            toggleModalVisible={this.toggleModal}
                        />: null}

                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
