import React from 'react';
import { View } from 'react-native';
import { Cell } from './cell';

export const Col = props => {
	const { data, theme, wth,height } = props;
	return data ? (
		<View >
		{data.map((item, i) => {
			return (
			<View style={{backgroundColor: i%2 === 0 ?'#E1FBFF':'white',color: '#989898'}}>
				<Cell
					rowKey={item['rowKey']}
					colKey={item['colKey']}
					type={item['type']}
					value={item['value']}
					key={i}
					editable={item['editable']}
					theme={theme}
					width={wth}
					height={height}
					color= {'black'}
				/>
			</View>		
			
			);
		})}
		</View>
	) : null;
}
