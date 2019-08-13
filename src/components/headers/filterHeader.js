import React from 'react';
import { Header, Left, Right, Icon, Body, Button, Title } from 'native-base';

const FilterHeader = props => {
    const { theme, toggleFilterModalVisible } = props;
    return (
        <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
            <Left>
                <Button transparent onPress={() => toggleFilterModalVisible()}>
                    <Icon name="arrow-back" style={theme.headerLeftIcon} />
                </Button>
            </Left>
            <Body>
                <Title style={theme.headerText}>{'Filter'}</Title>
            </Body>
            <Right />
        </Header>
    );
};

export default FilterHeader;
