import React from 'react';
import { View, ArrowBackIcon, Text } from 'native-base';
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradientHeader from './linearGradientHeader';

import styles from './../../fields/userDirectory/styles';

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
        <View style={styles.headerWrapper}>
             <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.headerLeft}
                        onPress={() => toggleModalVisible()}
                    >
                        <ArrowBackIcon size={"6"} color={"rgb(0,151,235)"} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.headerCenter,{flex:3}]}>
                    <Text style={theme.headerText}>{label || 'Select'}</Text>
                </View>

            <View style={[styles.headerRight,{flex:2}]}>
                 {pullToRefreshEnable &&
                typeof handlePullToRefresh === 'function' ? ( 
                    <TouchableOpacity
                    style={styles.headerLeft}
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
                    </TouchableOpacity>
                   ) : null}  
                  {filterEnable ? (  
                    <TouchableOpacity
                    style={styles.headerLeft}
                        onPress={() => toggleFilterModalVisible()}
                    >
                        <Icon
                            name="filter"
                            style={[theme.headerLeftIcon, { fontSize: 18 }]}
                            type="FontAwesome"
                        />
                    </TouchableOpacity>
                  ) : null}  
                  {barcodeEnable ? (  
                    <TouchableOpacity
                    style={styles.headerLeft}
                        onPress={() => toggleBarcodeModalVisible()}
                    >
                        <Icon
                            name="qrcode"
                            style={[theme.headerLeftIcon, { fontSize: 18 }]}
                            type="FontAwesome"
                        />
                    </TouchableOpacity>
                   ) : null}  
                 {searchEnable ? ( 
                    <TouchableOpacity
                    style={styles.headerLeft}
                        onPress={() => toggleSearchModalVisible()}
                    >
                        <Icon
                            name="search"
                            style={[theme.headerLeftIcon, { fontSize: 18 }]}
                            type="FontAwesome"
                        />
                    </TouchableOpacity>
                 ) : null} 
            </View>
            </View>
            <LinearGradientHeader />
        </View>
    );
};

export default LookupHeader;
