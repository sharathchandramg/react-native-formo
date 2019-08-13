import React from 'react';
import {
    Header,
    Left,
    Right,
    Icon,
    Body,
    Button,
    Input,
    Item,
} from 'native-base';

const SearchHeader = props => {
    const {
        toggleSearchModalVisible,
        handleOnSearchQuery,
        handleTextChange,
        theme,
        searchText,
    } = props;
    return (
        <Header style={[theme.header]} androidStatusBarColor="#c8c8c8">
            <Left>
                <Button transparent onPress={() => toggleSearchModalVisible()}>
                    <Icon name="arrow-back" style={theme.headerLeftIcon} />
                </Button>
            </Left>
            <Body>
                <Item style={{ height: 30, width: '100%' }}>
                    <Input
                        keyboardType={'default'}
                        underlineColorAndroid="transparent"
                        numberOfLines={2}
                        placeholder={'Search'}
                        autoFocus={true}
                        value={searchText}
                        onChangeText={text => handleTextChange(text)}
                        returnKeyType={'search'}
                        onSubmitEditing={() => handleOnSearchQuery(searchText)}
                    />
                </Item>
            </Body>
            <Right>
                <Button
                    transparent
                    onPress={() => handleOnSearchQuery(searchText)}
                >
                    <Icon
                        name="search"
                        style={[theme.headerLeftIcon, { fontSize: 18 }]}
                        type="FontAwesome"
                    />
                </Button>
            </Right>
        </Header>
    );
};

export default SearchHeader;
