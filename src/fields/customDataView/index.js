import PropTypes from "prop-types";
import React, { Component } from "react";
import {TouchableOpacity } from "react-native";
import StarIcon from "../../components/starIcon"
import {
    View,
    Text,
    Icon,
} from "native-base";
import styles from "./styles"

export default class CustomDataComponent extends Component {

    static propTypes = {
        attributes: PropTypes.object,
        updateValue: PropTypes.func,
        theme: PropTypes.object,
        ErrorComponent: PropTypes.func,
        onCustomDataView:PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    handleOnclick =()=> {
        if(typeof this.props.onCustomDataView === 'function'){
            this.props.onCustomDataView(this.props)
        }
        return
    }

    getLabel =(value)=>{
        let label = "None"
        if(typeof value !=='undefined' && value && Object.keys(value).length){
            return value.label?value.label:'None';
        }
        return label;
    }

    renderlookupIcon = () => {
        return (
            <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => this.handleOnclick()}
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
                        onPress={() => this.handleOnclick()}
                    >
                        <View style = {styles.labelTextWrapper}>
                            <Text style={[styles.labelText]} numberOfLines={2}>
                                {attributes['required'] && <StarIcon required={attributes['required']} />}
                                {attributes.label}
                            </Text>
                        </View>
                        <View style={styles.valueWrapper}>
                            <Text style={styles.inputText} numberOfLines={2}>{this.getLabel(attributes.value)} </Text>
                        </View>
                        {this.renderlookupIcon()}
                    </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
