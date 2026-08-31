import { Href, router } from 'expo-router';

const rootRoutes = '(root)' as const;

export const ScreenRoutes = {
  index: '/',
  home: `${rootRoutes}/(tabs)/home`,
} as const;

type NavigateMethod = 'push' | 'replace' | 'back' | 'dismissAll' | 'dismissTo';

export const navigate = <T extends keyof typeof ScreenRoutes>(
  route: T,
  method: NavigateMethod = 'push'
) => {
  router[method](ScreenRoutes[route] as Href);
};
