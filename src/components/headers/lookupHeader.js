import React from 'react';
import { Header, Left, Right, Icon, Body, Button, Title } from 'native-base';

const LookupHeader = props => {
    const {
        label,
        filterEnable,
        searchEnable,
        barcodeEnable,
        toggleFilterModalVisible,
        toggleSearchModalVisible,
        toggleBarcodeModalVisible,
        toggleModalVisible,
        theme,
        handlePullToRefresh,
        pullToRefreshEnable,
        loading,
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
                {pullToRefreshEnable &&
                typeof handlePullToRefresh === 'function' ? (
                    <Button
                        transparent
                        onPress={() => !loading && handlePullToRefresh()}
                    >
                        <Icon
                            name="refresh"
                            style={[
                                theme.headerLeftIcon,
                                {
                                    fontSize: 18,
                                    color: loading
                                        ? '#FA9917'
                                        : 'rgb(0,151,235)',
                                },
                            ]}
                            type="FontAwesome"
                        />
                    </Button>
                ) : null}
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
                {barcodeEnable ? (
                    <Button
                        transparent
                        onPress={() => toggleBarcodeModalVisible()}
                    >
                        <Icon
                            name="qrcode"
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
