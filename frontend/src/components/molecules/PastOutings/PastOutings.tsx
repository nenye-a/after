import { View } from 'react-native';
import React from 'react';
import { AfterInput } from '@/components/atoms';
import { useTheme } from '@/theme';
import { useMapSheet } from '@/context/MapSheetContext';
import { Dropdown } from 'react-native-element-dropdown';

type Props = {};

const exampleCityList = [
  {
    label: 'All Cities',
    value: 'all-cities',
  },
  {
    label: 'New York',
    value: 'new-york',
  },
  {
    label: 'Los Angeles',
    value: 'los-angeles',
  },
  {
    label: 'Chicago',
    value: 'chicago',
  },
  {
    label: 'Houston',
    value: 'houston',
  },
  {
    label: 'Phoenix',
    value: 'phoenix',
  },
  {
    label: 'Philadelphia',
    value: 'philadelphia',
  },
  {
    label: 'San Antonio',
    value: 'san-antonio',
  },
  {
    label: 'San Diego',
    value: 'san-diego',
  },
  {
    label: 'Dallas',
    value: 'dallas',
  },
  {
    label: 'San Jose',
    value: 'san-jose',
  },
];

const PastOutings = (props: Props) => {
  const { layout, gutters, components, colors, fonts } = useTheme();
  const {} = useMapSheet();

  return (
    <View style={[layout.row, layout.justifyBetween]}>
      <AfterInput
        viewStyle={[{ flex: 2 }, gutters.marginRight_8]}
        icon="search"
        iconColor="white"
        placeholder="Search"
      />
      <Dropdown
        placeholder="Select City"
        value={exampleCityList[0]}
        selectedTextStyle={[{ color: colors.white }, fonts.size_14]}
        itemTextStyle={[{ color: colors.white }, fonts.size_14]}
        style={[{ flex: 1 }, components.dropDownSelectedStyle]}
        containerStyle={[components.dropDownListStyle]}
        itemContainerStyle={[{ borderRadius: 12 }]}
        data={exampleCityList}
        labelField="label"
        valueField="value"
        onChange={() => {}}
        activeColor={colors.gray300}
        fontFamily="Inter"
      />
    </View>
  );
};

export default PastOutings;
