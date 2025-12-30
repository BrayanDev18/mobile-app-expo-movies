import { Href, router } from 'expo-router';

const authRoutes = '(auth)' as const;
const rootRoutes = '(root)' as const;

export const ScreenRoutes = {
  index: '/',
  welcome: `${authRoutes}/welcome`,
  signIn: `${authRoutes}/sign-in`,
  singUp: `${authRoutes}/sign-up`,
  conversations: `${rootRoutes}/(home-tabs)/conversations`,
  conversation: `${rootRoutes}/conversation/[conversationId]`,
  newChat: `${rootRoutes}/new-chat`,
  newGroup: `${rootRoutes}/new-group`,
  newContact: `${rootRoutes}/new-contact`,
  countriesList: `${rootRoutes}/countries-list`,

  editProfile: `${rootRoutes}/edit-profile`,
} as const;

type NavigateMethod = 'push' | 'replace' | 'back' | 'dismissAll' | 'dismissTo';

export const navigate = <T extends keyof typeof ScreenRoutes>(
  route: T,
  method: NavigateMethod = 'push'
) => {
  router[method](ScreenRoutes[route] as Href);
};
