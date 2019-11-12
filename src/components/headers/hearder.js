import React from 'react';
import { Header, Left, Right, Icon, Body, Button, Title } from 'native-base';

const CustomHeader = props => {
    const { theme, toggleModalVisible, attributes } = props;
    return (
        <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
            <Left>
                <Button transparent onPress={() => toggleModalVisible()}>
                    <Icon name="arrow-back" style={theme.headerLeftIcon} />
                </Button>
            </Left>
            <Body>
                <Title style={theme.headerText}>{ attributes.label || "Select"}</Title>
            </Body>
            <Right />
        </Header>
    );
};

export default CustomHeader;