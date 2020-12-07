import React from 'react';
import SearchHeader from '../headers/searchHeader';
import { Container, Content } from 'native-base';
import RecyclerList from '../recyclerList';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { isNull } from '../../utils/validators';
import styles from './styles';

const SearchComponent = props => {
    const {
        handleOnSearchQuery,
        theme,
        searchText,
        attributes,
        onEndReached,
        toggleSelect,
    } = props;
    return (
        <Container style={{ flex: 1 }}>
            <SearchHeader {...props} />
            <Content>
                <View style={{ height: '100%', width: '100%' }}>
                    {searchText.length > 0 ? (
                        <View style={styles.searchForWrapper}>
                            <TouchableOpacity
                                onPress={() =>
                                    handleOnSearchQuery(searchText, false)
                                }
                                style={styles.searchForButton}
                            >
                                <Icon
                                    name="search"
                                    type="FontAwesome"
                                    style={[
                                        theme.headerLeftIcon,
                                        { fontSize: 18, paddingRight: 20 },
                                    ]}
                                />
                                <Text style={styles.searchForText}>
                                    {`Search for "${searchText}"`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : !isNull(attributes['options']) &&
                      attributes['options'].length ? (
                        <RecyclerList
                            dataProvider={attributes['options']}
                            onEndReached={onEndReached}
                            attributes={attributes}
                            toggleSelect={toggleSelect}
                        />
                    ) : (
                        <ScrollView
                            centerContent={true}
                            contentContainerStyle={styles.contentContainer}
                        >
                            <View style={styles.noDataWrapper}>
                                <Text style={styles.nodataText}>
                                    {'No matching result found. Pl try again'}
                                </Text>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </Content>
        </Container>
    );
};

export default SearchComponent;
