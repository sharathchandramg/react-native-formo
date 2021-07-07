import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, FlatList, Alert } from 'react-native';
import { View, ListItem, Text, Item } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import styles from './styles';
import { isEmpty } from '../../utils/validators';
import _ from 'lodash';
import StarIcon from '../../components/starIcon';
import FileViewer from 'react-native-file-viewer';

const allowedDocumentTypes = {
    pdf: [DocumentPicker.types.pdf],
    images: [DocumentPicker.types.images],
    doc: [DocumentPicker.types.doc, DocumentPicker.types.docx],
    xls: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
};

const allowedContentTypes = {
    pdf: ['application/pdf'],
    images: ['image/gif', 'image/jpeg', 'image/png', 'image/webp'],
    doc: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    xls: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
};

export default class DocumentField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            filesArray: undefined,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    renderAlert = (msg, deleteDocumentFile=null) => {
        const { attributes } = this.props;
        Alert.alert(
            ``,
            `${msg}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('Cancel');
                    },
                    style: 'cancel',
                },
                {},
                {
                    text: 'OK',
                    onPress: () => {
                        if(!isEmpty(deleteDocumentFile)){
                            this.props.deleteDocument(attributes,deleteDocumentFile)
                        }
                        console.log('OK');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    deleteDocumentFile=(item)=>{
        this.renderAlert(`Selected file will be deleted permanently. Are you sure you want to delete`,item)
    }

    renderFileItem = ({ item }) => {
        const { theme } = this.props;
        return (
            <View
                style={{
                    height: 40,
                    marginBottom: 10,
                    borderColor: '#E0E0E0',
                    borderRadius: 5,
                    borderWidth: 1,
                }}
                key={item['uri']}
            >
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            color: theme.inputColorPlaceholder,
                            paddingStart: 5,
                            width: '75%',
                        }}
                        onPress={() => FileViewer.open(item['uri'])}
                    >
                        {item['name']}
                    </Text>
                    {!isEmpty(item['status']) ? (
                        <View
                            style={{
                                width: '25%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            {item['status'] === 'success' ? (
                                <Icon
                                    name={'check'}
                                    size={18}
                                    style={{ fontSize: 18, color: '#0CBD5B' }}
                                    onPress={() => console.log('tick')}
                                />
                            ) : (
                                <Icon
                                    name={'exclamation-triangle'}
                                    size={18}
                                    style={{ fontSize: 18, color: '#FA9917' }}
                                    onPress={() => console.log('tick')}
                                />
                            )}
                            <Icon
                                name={'trash'}
                                style={{ fontSize: 18, color: '#828282' }}
                                onPress={()=>this.deleteDocumentFile(item)}
                            />
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    };

    renderFileList = data => {
        if (!isEmpty(data)) {
            return (
                <FlatList
                    data={data}
                    extraData={this.props}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderFileItem}
                    nestedScrollEnabled={true}
                    ref={ref => {
                        this.flatListRef = ref;
                    }}
                />
            );
        }
        return null;
    };

    renderPreview = attributes => {
        const value = attributes.value;
        const filesArray = this.state.filesArray;

        let data = [];
        // if (!isEmpty(filesArray) && _.some(filesArray, 'uri')) {
        //     _.forEach(filesArray, file => {
        //         data.push(file);
        //     });
        // } else
        if (!isEmpty(value) && _.some(value, 'uri')) {
            _.forEach(value, file => {
                data.push(file);
            });
        }
        return (
            <View style={[styles.topContainer]}>
                {this.renderFileList(data)}
            </View>
        );
    };

    getDocumentConfiguration = () => {
        const { additional_config } = this.props.attributes;
        let documentTypes = [];
        let contentTypes = [];
        let multiple = false;
        let maxSize = null;
        let maxFiles = 1;

        if (!isEmpty(additional_config)) {
            if (!isEmpty(additional_config['file_type'])) {
              additional_config['file_type'].forEach(item => {
                    documentTypes = [
                        ...documentTypes,
                        ...allowedDocumentTypes[item],
                    ];
                    contentTypes = [
                        ...contentTypes,
                        ...allowedContentTypes[item],
                    ];
                });
            }
            maxSize = additional_config['max_size']
                ? additional_config['max_size']
                : 1048576;
            multiple = additional_config['multiple'] || false;
            maxFiles = multiple ? additional_config['max_files'] ? additional_config['max_files']: 1 : 1;
        }

        return {
            documentTypes: isEmpty(documentTypes)
                ? [DocumentPicker.types.allFiles]
                : documentTypes,
            contentTypes: !isEmpty(contentTypes) ? contentTypes : [],
            multiple,
            maxSize,
            maxFiles,
        };
    };

    singleFileValidationsAndUpload = (config, res) => {
        const { attributes, handleDocumentUpdateAndDownload } = this.props;
        const value = attributes.value;

        if (this.isFileExists(res['name'], value)) {
            this.renderAlert(`File already exists`);
        } else if (
            !config['multiple'] &&
            !isEmpty(value) &&
            value.length >= 1
        ) {
            this.renderAlert(`Only one file allowed`);
        } else if (!config['contentTypes'].includes(res['type'])) {
            this.renderAlert(`Selected file type is not allowed`);
        } else if (isEmpty(res['size'])) {
            this.renderAlert(`Please choose proper file`);
        } else if (res['size'] > config['maxSize']) {
            this.renderAlert(
                `Please choose file less than ${this.getBytesToMB(
                    config['maxSize']
                )} MB`
            );
        } else {
            if (typeof handleDocumentUpdateAndDownload === 'function') {
                handleDocumentUpdateAndDownload(attributes, [res], 'write');
            }
        }
    };

    getAllFiles = results => {
        const { attributes } = this.props;
        const value =
            !isEmpty(attributes) && !isEmpty(attributes.value)
                ? attributes.value
                : [];
        return [...results, ...value];
    };

    isFileExists = (res, allFiles) => {
        if (!isEmpty(allFiles)) {
            const fileIndex = allFiles.findIndex(ele => ele && ele['name'] === res);
            if (fileIndex >= 0) return true;
        }
        return false;
    };

    removeDuplicateFiles = (results, existsFiles) => {
        const updatedResults = [];
        if (!isEmpty(results)) {
            results.forEach(ele => {
                if (!existsFiles.includes(ele['name'])) {
                    updatedResults.push(ele);
                }
            });
        }
        return updatedResults;
    };

    multiFileValidationsAndUpload = (config, results) => {
        const { attributes, handleDocumentUpdateAndDownload } = this.props;

        let error = false;
        const value =
            !isEmpty(attributes) && !isEmpty(attributes.value)
                ? attributes.value
                : [];
        const existsFiles = [];
        const allFiles = this.getAllFiles(results);

        if (config['multiple'] && allFiles.length > config['maxFiles']) {
            error = true;
            this.renderAlert(
                `Maximum files to be allowed is ${config['maxFiles']}`
            );
            return;
        }

        for (const res of results) {
            if (!config['contentTypes'].includes(res['type'])) {
                error = true;
                this.renderAlert(`${res['name']} file type is not allowed`);
                return;
            } else if (isEmpty(res['size'])) {
                error = true;
                this.renderAlert(
                    `${
                        res['name']
                    } file size is empty. Please choose proper file`
                );
                return;
            } else if (res['size'] > config['maxSize']) {
                error = true;
                this.renderAlert(
                    `${
                        res['name']
                    } file size is greater than ${this.getBytesToMB(
                        config['maxSize']
                    )} MB. Please choose file less than ${this.getBytesToMB(
                        config['maxSize']
                    )} MB`
                );
                return;
            } else if (this.isFileExists(res['name'], value)) {
                existsFiles.push(res['name']);
            }
        }

        const updatedResults = !isEmpty(existsFiles)
            ? this.removeDuplicateFiles(results, existsFiles)
            : results;

        if (!error && updatedResults.length > 0) {
            if (typeof handleDocumentUpdateAndDownload === 'function') {
                handleDocumentUpdateAndDownload(
                    attributes,
                    updatedResults,
                    'write'
                );
            }
        }
    };

    getBytesToMB = bytes => {
        return bytes / (1024 * 1024);
    };

    onPressDocument = async () => {
        if(this.props.isConnected){
            const config = this.getDocumentConfiguration();

            if (config['multiple']) {
                const results = await DocumentPicker.pickMultiple({
                    type: config['documentTypes'],
                });
                this.multiFileValidationsAndUpload(config, results);
            } else {
                const res = await DocumentPicker.pick({
                    type: config['documentTypes'],
                });
                this.singleFileValidationsAndUpload(config, res);
            }
        } else {
            this.renderAlert(`This field required internet connectivity`);
        }
    };

    renderFileIcon = () => {
        return (
            <TouchableOpacity
                style={styles.valueContainer}
                onPress={() => this.onPressDocument()}
            >
                <Icon
                    name="file"
                    size={24}
                    type={'regular'}
                    color={'#828282'}
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        );
    };

    isDocumentFilesExists = () => {
        const filesArray = this.state.filesArray;
        const value = this.props.attributes['value'] || '';
        if (!isEmpty(filesArray) || !isEmpty(value)) {
            return true;
        }
        return false;
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <View>
                <View>
                    <ListItem
                        style={{
                            borderBottomWidth: 0,
                            paddingVertical: 5,
                            marginLeft: 20,
                        }}
                    >
                        <View style={{ flexDirection: 'row', flex: 2 }}>
                            <Item
                                error={
                                    theme.changeTextInputColorOnError
                                        ? attributes.error
                                        : null
                                }
                                style={{ paddingVertical: 10 }}
                            >
                                {attributes['required'] && (
                                    <StarIcon
                                        required={attributes['required']}
                                    />
                                )}
                                <Text
                                    style={{
                                        flex: 1,
                                        color: theme.inputColorPlaceholder,
                                        paddingStart: 5,
                                    }}
                                >
                                    {attributes.label}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                    }}
                                    onPress={() => this.onPressDocument()}
                                >
                                    {this.renderFileIcon()}
                                </TouchableOpacity>
                            </Item>
                        </View>
                    </ListItem>
                    {this.isDocumentFilesExists()
                        ? this.renderPreview(attributes)
                        : null}
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </View>
            </View>
        );
    }
}
