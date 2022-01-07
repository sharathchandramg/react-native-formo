import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, FlatList, Alert } from 'react-native';
import { View, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import styles from './styles';
import { isEmpty } from '../../utils/validators';
import _ from 'lodash';
import StarIcon from '../../components/starIcon';

const allowedDocumentTypes = {
    pdf: [DocumentPicker.types.pdf],
    images: [DocumentPicker.types.images],
    doc: [DocumentPicker.types.doc, DocumentPicker.types.docx],
    xls: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
};

const allowedContentTypes = {
    pdf: ['application/pdf'],
    images: ['image/jpeg', 'image/png'],
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

    /**
     * Delete document file
     */
    deleteDocumentFile = item => {
        this.renderAlert(`Selected file will be deleted permanently. Are you sure you want to delete`,item)
    }

    /**
     * Render success and warning icons
     * if status is success or if file has file_path, then show the success icon
     * otherwise warning
     */
    renderSuccessWarningIcon = item => {
        return item['status'] === 'success' || item['file_path'] ? (
            <Icon
                name={'check'}
                size={18}
                style={{ fontSize: 18, color: '#0CBD5B' }}
            />
        ) : (
            <Icon
                name={'exclamation-triangle'}
                size={18}
                style={{ fontSize: 18, color: '#FA9917' }}
            />
        );
    };

    /**
     * Render document 
     */
    renderFileItem = ({ item }) => {
        const { theme, handlePreviewDocument } = this.props;
        return (
            <View
                style={styles.fileTopWrapper}
                key={item['uri'] || item['file_path']}
            >
                <TouchableOpacity style={styles.fileInnerWrapper}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            color: theme.inputColorPlaceholder,
                            paddingStart: 5,
                            width: '75%',
                        }}
                        onPress={() => {
                            if (typeof handlePreviewDocument === 'function') {
                                handlePreviewDocument(item);
                            }
                        }}
                    >
                        {item['name']}
                    </Text>
                        <View style={styles.fileIconWrapper}>
                            {/* {this.renderSuccessWarningIcon(item)} */}
                            <Icon
                                name={'trash'}
                                style={{ fontSize: 18, color: '#828282' }}
                                onPress={()=>this.deleteDocumentFile(item)}
                            />
                        </View>
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

    /**
     * Render all documents
     * If attribute value has uri or file_path, then push that object to render data
     */
    renderAllDocuments = attributes => {
        const value = attributes.value;
        let data = [];
        if (!isEmpty(value) && (_.some(value, 'uri') || _.some(value, 'file_path'))) {
            _.forEach(value, file => {
                data.push(file);
            });
        }
        return (
            <View style={styles.topContainer}>
                {this.renderFileList(data)}
            </View>
        );
    };

    /**
     * Get the document configuration form field additional_config
     * Create documentTypes and contentTypes based on the file_type values from additional_config
     * Default value for max size is 1048576(1MB)
     */
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

    /**
     * Upload single file and validations
     * Validations: If selected file name is already exists
     *              If user selects more than one file
     *              If selected file content type is not in a additional_config
     *              If selected file size is empty
     *              If selected file size is greater than the additional_config max_size
     * If all validations pass, the call the handleDocumentUpdateAndDownload function with values attributes and selected file in array
     */
    uploadSingleFile = (config, res) => {
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
                `Please select file size less than ${this.getBytesToMB(
                    config['maxSize']
                )} MB`
            );
        } else {
            if (typeof handleDocumentUpdateAndDownload === 'function') {
                handleDocumentUpdateAndDownload(attributes, [res]);
            }
        }
    };

    /**
     * Get selected file and attribute value
     */
    getAllFiles = results => {
        const { attributes } = this.props;
        const value =
            !isEmpty(attributes) && !isEmpty(attributes.value)
                ? attributes.value
                : [];
        return [...results, ...value];
    };

    /**
     * Check is selected file is already exists or not
     */
    isFileExists = (res, allFiles) => {
        if (!isEmpty(allFiles)) {
            const fileIndex = allFiles.findIndex(ele => ele && ele['name'] === res);
            if (fileIndex >= 0) return true;
        }
        return false;
    };

    /**
     * Remove duplicate selected files from array
     */
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

    /**
     * Upload multiple files and validations
     * Validations: If selected files are greater than additional_config max files
     *              If selected file content type is not in a additional_config
     *              If selected file size is empty
     *              If selected file size is greater than the additional_config max_size
     * If user selects existing file, then don't throw alert, remove duplicates from all selected files
     * If all validation pass, the call the handleDocumentUpdateAndDownload function with values attributes and selected in array
     */
    uploadMultipleFiles = (config, results) => {
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
                `Please note maximum files allowed is ${config['maxFiles']}`
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
                    )} MB. Please select file size less than ${this.getBytesToMB(
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
                    updatedResults
                );
            }
        }
    };

    /**
     * Convert bytes to MB
     */
    getBytesToMB = bytes => {
        return bytes / (1024 * 1024);
    };

    /**
     * Open file select on click of document field 
     * ased on additional_config multiple key, it will open multiple file select or single file select
     * Only allowed when internet is connected
     * Otherwise throw alert
     */
    onPressDocument = async () => {
        if(this.props.isConnected){
            const config = this.getDocumentConfiguration();

            if (config['multiple']) {
                const results = await DocumentPicker.pickMultiple({
                    type: config['documentTypes'],
                    copyTo: 'documentDirectory',
                });
                this.uploadMultipleFiles(config, results);
            } else {
                const res = await DocumentPicker.pick({
                    type: config['documentTypes'],
                    copyTo: 'documentDirectory',
                });
                this.uploadSingleFile(config, res);
            }
        } else {
            this.renderAlert(`This field required internet connectivity`);
        }
    };

    /**
     * Render file icon
     */
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

    /**
     * Check is attributes value exists or not, to render the documents
     */
    isFilesExists = () => {
        const value = this.props.attributes['value'] || '';
        if (!isEmpty(value)) {
            return true;
        }
        return false;
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
          <View>
            <View>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: theme.inputColorPlaceholder,
                    flex: 2,
                    flexDirection: "row",
                    paddingVertical: 10,
                  }}
                >
                  {attributes["required"] && (
                    <StarIcon required={attributes["required"]} />
                  )}
                  <Text
                    style={{
                      flex: 1,
                      color: theme.inputColorPlaceholder,
                      paddingStart: 5,
                      fontSize:18
                    }}
                  >
                    {attributes.label}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      flex: 1,
                    }}
                    onPress={() => this.onPressDocument()}
                  >
                    {this.renderFileIcon()}
                  </TouchableOpacity>
                </View>
              </View>
              {this.isFilesExists()
                ? this.renderAllDocuments(attributes)
                : null}
            </View>
            <View style={{ paddingHorizontal: 15 }}>
              <ErrorComponent {...{ attributes, theme }} />
            </View>
          </View>
        );
    }
}
