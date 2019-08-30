import React from 'react';
import SearchHeader from '../headers/searchHeader';
import { Container, Content } from 'native-base';
import RecyclerList from '../recyclerList';
import { View, ScrollView, Text } from 'react-native';
import { isNull } from '../../utils/validators';
import styles from './styles';

const SearchComponent = props => {
    return (
        <Container style={{ flex: 1 }}>
            <SearchHeader {...props} />
            <Content>
                <View style={{ height: '100%', width: '100%' }}>
                    {!isNull(props.attributes['options']) &&
                    props.attributes['options'].length ? (
                        <RecyclerList
                            dataProvider={props.attributes['options']}
                            onEndReached={props.onEndReached}
                            attributes={props.attributes}
                            toggleSelect={props.toggleSelect}
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
