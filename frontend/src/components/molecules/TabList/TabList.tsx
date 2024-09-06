import { AfterText } from '@/components/atoms';
import { useTheme } from '@/theme';
import { TabProps, TabSelectProps } from '@/types/components/tabs';
import { ReactNode, useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

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
  const { tabOptions, activeTab } = props;

  const [options, setOptions] = useState<TabProps[]>(
    activeTab
      ? tabOptions.map((option) => ({
          ...option,
          active: option.text === activeTab,
        }))
      : [
          { ...tabOptions[0], active: true },
          ...tabOptions
            .slice(1)
            .map((option) => ({ ...option, active: false })),
        ],
  );

  const highlightOnPress = (index: number) => {
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
        <Tab
          {...item}
          key={index}
          onPress={(pressProps) => {
            highlightOnPress(index);
            item.onPress && item.onPress(pressProps);
          }}
        />
      )}
      style={props.style}
    />
  );
}
