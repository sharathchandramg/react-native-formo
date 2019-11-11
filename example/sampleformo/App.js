import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";

import Form0 from "react-native-form0";
import { Button } from "native-base";
// const fields = require("./schema/09-image.json");
const _ = require("lodash");

const fields= [
    {
        type: 'simple-grid',
        name: 'quality_evaluation',
        label: 'Quality Evaluation',
        required: true,
        editable: true,
        hidden: false,
        searchable: false,
        data_source: {
            type: 'local',
            referenceId: '',
            refersheet: 'Ref#QEval',
            filterQuery: '',
        },
        data: {
            header: { Comments: 'Comments' },
            type: { Comments: 'Text' },
            style: { column_width: { Comments: 300 }, row_height: 40 },
            'Tech Comments': { Comments: null },
            T1: { Comments: null },
            T2: { Comments: null },
            T3: { Comments: null },
            T4: { Comments: null },
            T5: { Comments: null },
            T6: { Comments: null },
            T7: { Comments: null },
            T8: { Comments: null },
            T9: { Comments: null },
            T10: { Comments: null },
        },
    },
    {
        type: 'simple-grid',
        name: 'fabric_inspection',
        label: 'Fabric Inspection',
        required: true,
        editable: true,
        hidden: false,
        searchable: false,
        data_source: {
            type: 'local',
            referenceId: '',
            refersheet: 'Ref#FInsp',
            filterQuery: '',
        },
        data: {
            header: {
                Required: 'Required',
                Actual: 'Actual',
                Comments: 'Comments',
            },
            type: { Required: 'Number', Actual: 'Number', Comments: 'Text' },
            style: {
                column_width: { Required: 80, Actual: 80, Comments: 300 },
                row_height: 40,
            },
            Reed: { Required: null, Actual: null, Comments: null },
            Pick: { Required: null, Actual: null, Comments: null },
            GSM: { Required: null, Actual: null, Comments: null },
            'Shrinkage- Length': {
                Required: null,
                Actual: null,
                Comments: null,
            },
            'Shringage- Width': {
                Required: null,
                Actual: null,
                Comments: null,
            },
            'Fastness Dry': { Required: null, Actual: null, Comments: null },
            'Fastness Wet': { Required: null, Actual: null, Comments: null },
            'Fastness Dryclean': {
                Required: null,
                Actual: null,
                Comments: null,
            },
            'Fastness to Wash': {
                Required: null,
                Actual: null,
                Comments: null,
            },
        },
    },
    {
        type: 'simple-grid',
        name: 'quality_comments',
        label: 'Quality Comments',
        required: false,
        editable: true,
        hidden: false,
        searchable: false,
        data_source: {
            type: 'local',
            referenceId: '',
            refersheet: 'Ref#QComments',
            filterQuery: '',
        },
        data: {
            header: { Comments: 'Comments' },
            type: { Comments: 'Text' },
            style: { column_width: { Comments: 300 }, row_height: 40 },
            C1: { Comments: null },
            C2: { Comments: null },
            C3: { Comments: null },
            C4: { Comments: null },
            C5: { Comments: null },
            C6: { Comments: null },
            C7: { Comments: null },
            C8: { Comments: null },
            C9: { Comments: null },
            C10: { Comments: null },
        },
    },
    {
        type: 'simple-grid',
        name: 'action_plan',
        label: 'Action Plan',
        required: false,
        editable: true,
        hidden: false,
        searchable: false,
        data_source: {
            type: 'local',
            referenceId: '',
            refersheet: 'Ref#ActionPlan',
            filterQuery: '',
        },
        data: {
            header: { Comments: 'Comments' },
            type: { Comments: 'Text' },
            style: { column_width: { Comments: 250 }, row_height: 40 },
            A1: { Comments: null },
            A2: { Comments: null },
            A3: { Comments: null },
            A4: { Comments: null },
            A5: { Comments: null },
            A6: { Comments: null },
            A7: { Comments: null },
            A8: { Comments: null },
            A9: { Comments: null },
            A10: { Comments: null },
            A11: { Comments: null },
            A12: { Comments: null },
            A13: { Comments: null },
            A14: { Comments: null },
            A15: { Comments: null },
        },
    },
];

export default class App extends Component {

	constructor(props){
		super(props);
		this.state ={
			fields : fields,
			formData: {},

		}
	}

	handleOnGetQuery =(attribute)=>{
		// update the field options/data;
		let fields = this.state.fields;
		let index = _.findIndex(fields,{"name": attribute["name"]})
		if(index !== -1){
			attribute['options'] = [{
                "user_id": 3,
                "user_name": "Nitheesh",
                "city": "Bengaluru",
                "city_state": "Karnataka"
			}]
			fields[index] = {...attribute};
		}
		this.setState({fields:fields})
	}

	handleOnSearchQuery =(attributes,searchText)=>{
		// update the field options/data;
		const {labelKey,options} = attributes;
		let updatedOption = [];
		let fields = this.state.fields;
		let index = _.findIndex(fields,{"name": attributes["name"]})
		if(index !== -1){
			updatedOption = _.filter(options,(item)=>{
				let sItem = (item[labelKey]).toString().toLowerCase().search(searchText.trim().toLowerCase()) > -1;
				if(sItem) {
					return item;
				}
			})
			attributes['options'] = [...updatedOption];
			fields[index] = {...attributes};
		}
		this.setState({fields:fields})
	}


	render() {
		
		// const formData = {
		// 	prospect_name: "MTV",
		// 	work_address: [
		// 		{
		// 			city: "BLR",
		// 			country: "IND"
		// 		}
		// 	],
		// 	product: [
		// 		{
		// 			sku_discount: "0",
		// 			sku_quantity: "10",
		// 			sku_unit_price: "1000",
		// 			sku: {
		// 				product_name: "MM 2",
		// 				product_id: "MM 2"
		// 			}
		// 		},
		// 		{
		// 			sku_discount: "10",
		// 			sku_quantity: "5",
		// 			sku_unit_price: "100",
		// 			sku: {
		// 				product_name: "MM 1",
		// 				product_id: "MM 1"
		// 			}
		// 		}
		// 	]
		// };
		// console.log(fields);


		return (
			<ScrollView>
				<Form0
					fields={this.state.fields}
					formData={this.state.formData}
					ref={c => {
						this.formGenerator = c;
					}}
					onGetQuery={this.handleOnGetQuery}
					onSearchQuery ={this.handleOnSearchQuery}
				/>

				<View>
					<Button
						full
						info
						onPress={() =>console.log(this.formGenerator.getValues())}
					>
						<Text>Submit</Text>
					</Button>
					<Button full warning onPress={() => this.formGenerator.resetForm()}>
						<Text>Clear Form</Text>
					</Button>
					<Button
						full
						info
						onPress={() => console.log(this.formGenerator.onValidateFields())}
					>
						<Text>Validate Form</Text>
					</Button>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#F5FCFF",
		justifyContent: "space-between"
	}
});
