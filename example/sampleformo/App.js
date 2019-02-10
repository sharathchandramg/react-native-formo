import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";

import Form0 from "react-native-form0";
import { Button } from "native-base";

export default class App extends Component {
	render() {
		const fields = require("./schema/07-select.json");
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
					fields={fields}
					formData={{}}
					ref={c => {
						this.formGenerator = c;
					}}
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
