import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";

import Form0 from "react-native-form0";
import { Button } from "native-base";
const fields = require("./schema/10-lookup.json");
const _ = require("lodash");

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
