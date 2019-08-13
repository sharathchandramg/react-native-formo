import React from 'react';
import SearchHeader from '../headers/searchHeader';
import { Container, Content } from 'native-base';

const SearchComponent = props => {
    return (
        <Container style={{ flex: 1 }}>
            <SearchHeader {...props} />
            <Content />
        </Container>
    );
};

export default SearchComponent;
