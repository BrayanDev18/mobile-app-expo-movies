import { Href, router } from 'expo-router';

const authRoutes = '(auth)' as const;
const rootRoutes = '(root)' as const;

export const ScreenRoutes = {
  index: '/',
  welcome: `${authRoutes}/welcome`,
  home: `${rootRoutes}/(tabs)/home`,

  //movie
  videos: `${rootRoutes}/movie/videos`,
} as const;

type NavigateMethod = 'push' | 'replace' | 'back' | 'dismissAll' | 'dismissTo';

export const navigate = <T extends keyof typeof ScreenRoutes>(
  route: T,
  method: NavigateMethod = 'push'
) => {
  router[method](ScreenRoutes[route] as Href);
};
