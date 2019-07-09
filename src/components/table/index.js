import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, FlatList ,ScrollView} from 'react-native';

import {
    Text,
    Container,
    Header,
    Content,
    Left,
    Right,
    Icon,
    Body,
    Button,
    Title,
} from 'native-base';

const Table = props => {
    let {
        attributes,
        theme,
        modalVisible,
        toggleModalVisible,
    } = props;

    return (
        <Modal
            visible={modalVisible}
            animationType="none"
            onRequestClose={() => toggleModalVisible()}
        >
            <Container style={{ flex: 1 }}>
                <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
                    <Left>
                        <Button
                            transparent
                            onPress={() => toggleModalVisible()}
                        >
                            <Icon
                                name="arrow-back"
                                style={{ color: '#48BBEC' }}
                            />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={theme.headerText}>
                            {attributes.label || 'Select'}
                        </Title>
                    </Body>
                </Header>
                <Content>
                    <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                        <Text>Coming soon</Text>
                    </View>  
                </Content>
            </Container>
        </Modal>
    );
};

export default Table;