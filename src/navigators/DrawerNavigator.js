/* @flow */

import React from 'react';
import { Dimensions, Platform } from 'react-native';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import DrawerScreen from '../views/Drawer/DrawerScreen';
import DrawerView from '../views/Drawer/DrawerView';
import DrawerItems from '../views/Drawer/DrawerNavigatorItems';

import NavigatorTypes from './NavigatorTypes';

import type { DrawerViewConfig } from '../views/Drawer/DrawerView';
import type {
  NavigationRouteConfigMap,
  NavigationTabRouterConfig,
} from '../TypeDefinition';

export type DrawerNavigatorConfig = {
  containerConfig?: void,
} & NavigationTabRouterConfig &
  DrawerViewConfig;

const DefaultDrawerConfig = {
  /*
   * Default drawer width is screen width - header width
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  drawerWidth:
    Dimensions.get('window').width - (Platform.OS === 'android' ? 56 : 64),
  contentComponent: DrawerItems,
  drawerPosition: 'left',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerLockMode: 'unlocked',
  style: {},
};

const DrawerNavigator = (
  routeConfigs: NavigationRouteConfigMap,
  config: DrawerNavigatorConfig
) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const {
    containerConfig,
    drawerWidth,
    contentComponent,
    contentOptions,
    drawerPosition,
    drawerOpenRoute,
    drawerCloseRoute,
    drawerLockMode,
    style,
    ...tabsConfig
  } = mergedConfig;

  const contentRouter = TabRouter(routeConfigs, tabsConfig);

  const drawerRouter = TabRouter(
    {
      [drawerCloseRoute]: {
        screen: createNavigator(
          contentRouter,
          routeConfigs,
          config,
          NavigatorTypes.DRAWER
        )((props: *) => <DrawerScreen {...props} />),
      },
      [drawerOpenRoute]: {
        screen: () => null,
      },
    },
    {
      initialRouteName: drawerCloseRoute,
    }
  );

  const navigator = createNavigator(
    drawerRouter,
    routeConfigs,
    config,
    NavigatorTypes.DRAWER
  )((props: *) =>
    <DrawerView
      {...props}
      drawerWidth={drawerWidth}
      contentComponent={contentComponent}
      contentOptions={contentOptions}
      drawerPosition={drawerPosition}
      drawerOpenRoute={drawerOpenRoute}
      drawerCloseRoute={drawerCloseRoute}
      drawerLockMode={drawerLockMode}
      style={style}
    />
  );

  return createNavigationContainer(navigator);
};

export default DrawerNavigator;
