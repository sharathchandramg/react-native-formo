import React from 'react';
import { Header, Left, Right, Icon, Body, Button, Title } from 'native-base';

const LookupHeader = props => {
    const {
        label,
        filterEnable,
        searchEnable,
        toggleFilterModalVisible,
        toggleSearchModalVisible,
        toggleModalVisible,
        theme,
    } = props;
    return (
        <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
            <Left>
                <Button transparent onPress={() => toggleModalVisible()}>
                    <Icon name="arrow-back" style={theme.headerLeftIcon} />
                </Button>
            </Left>
            <Body>
                <Title style={theme.headerText}>{label || 'Select'}</Title>
            </Body>
            <Right>
                {filterEnable ? (
                    <Button
                        transparent
                        onPress={() => toggleFilterModalVisible()}
                    >
                        <Icon
                            name="filter"
                            style={[theme.headerLeftIcon, { fontSize: 18 }]}
                            type="FontAwesome"
                        />
                    </Button>
                ) : null}
                {searchEnable ? (
                    <Button
                        transparent
                        onPress={() => toggleSearchModalVisible()}
                    >
                        <Icon
                            name="search"
                            style={[theme.headerLeftIcon, { fontSize: 18 }]}
                            type="FontAwesome"
                        />
                    </Button>
                ) : null}
            </Right>
        </Header>
    );
};

export default LookupHeader;
