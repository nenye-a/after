import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  DevScreen: undefined;
  //  Boilerplate screens.
  // Startup: undefined;
  // Example: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
