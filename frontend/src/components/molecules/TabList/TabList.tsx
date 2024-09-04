import { AfterText } from '@/components/atoms';
import { useTheme } from '@/theme';
import { ReactNode, useEffect, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type BaseTabProps = {
  icon?: ReactNode;
  active?: boolean;
  text: string;
  style?: StyleProp<ViewStyle>; // Override default pressable style.
  border?: boolean;
};

type TabProps = PressableProps & BaseTabProps;
type TabSelectProps = {
  tabOptions: BaseTabProps[];
  style?: StyleProp<ViewStyle>;
};

export function Tab(props: TabProps) {
  const { components, fonts, gutters } = useTheme();
  const { active, text, style, border, icon, ...otherProps } = props;

  return (
    <Pressable
      style={[
        active ? components.activeTab : components.inactiveTab,
        border ? components.specialTabBorder : null,
        style,
      ]}
      {...otherProps}
    >
      {!!icon && <View style={[gutters.paddingHorizontal_8]}>{icon}</View>}
      <AfterText
        fontType="regular"
        style={active ? { ...fonts.white, ...fonts.medium } : fonts.gray300}
      >
        {text}
      </AfterText>
    </Pressable>
  );
}

export default function TabSelect(props: TabSelectProps) {
  const {} = useTheme();
  const { tabOptions } = props;

  const [options, setOptions] = useState<BaseTabProps[]>([
    { ...tabOptions[0], active: true },
    ...tabOptions.slice(1).map((option) => ({ ...option, active: false })),
  ]);

  const onPress = (index: number) => {
    setOptions(
      options.map((option, i) => ({ ...option, active: i === index })),
    );
  };

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={[{ width: 4 }]} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={options}
      renderItem={({ item, index }) => (
        <Tab {...item} key={index} onPress={() => onPress(index)} />
      )}
      style={props.style}
    />
  );
}
