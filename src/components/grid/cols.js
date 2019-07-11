import React from 'react';
import { View } from 'react-native';
import { Cell } from './cell';

export const Col = props => {
	const { data, theme, wth } = props;
	return data ? (
		<View>
		{data.map((item, i) => {
			return (
			<Cell
				rowKey={item['rowKey']}
				colKey={item['colKey']}
				type={item['type']}
				value={item['value']}
				key={i}
				editable={item['editable']}
				theme={theme}
				width={wth}
			/>
			);
		})}
		</View>
	) : null;
}
