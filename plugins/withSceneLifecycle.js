const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

// The iOS 27 SDK refuses to launch apps that don't adopt the UIScene life cycle
// ("UIScene life cycle is required for apps built with this SDK"). Expo 57 ships
// `ExpoAppSceneDelegate`, but its prebuild template doesn't wire it up yet, so this
// plugin does: the scene delegate creates the window and starts React Native, and
// the AppDelegate only creates the factory and exposes it.
// Remove once `expo prebuild` generates the scene-based template on its own.

const SCENE_DELEGATE_CLASS = 'EXExpoAppSceneDelegate';

const withSceneManifest = (config) =>
  withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: SCENE_DELEGATE_CLASS,
          },
        ],
      },
    };

    return cfg;
  });

const START_IN_APP_DELEGATE =
  /#if os\(iOS\) \|\| os\(tvOS\)\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\s*factory\.startReactNative\([\s\S]*?\)\s*#endif[ \t]*\n(?:[ \t]*\n)?/;

const withFactoryProvider = (config) =>
  withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language !== 'swift') {
      throw new Error('withSceneLifecycle: expected a Swift AppDelegate');
    }

    let contents = cfg.modResults.contents;

    if (contents.includes('ExpoReactNativeFactoryProvider')) return cfg;

    if (!START_IN_APP_DELEGATE.test(contents)) {
      throw new Error(
        'withSceneLifecycle: AppDelegate template changed — could not find the startReactNative block'
      );
    }

    contents = contents
      .replace(
        'class AppDelegate: ExpoAppDelegate {',
        'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
      )
      // The scene delegate owns the window now and starts React Native in it.
      .replace(START_IN_APP_DELEGATE, '');

    cfg.modResults.contents = contents;

    return cfg;
  });

module.exports = (config) => withFactoryProvider(withSceneManifest(config));
