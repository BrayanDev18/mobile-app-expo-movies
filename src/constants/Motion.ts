import { Easing } from 'react-native-reanimated';

// Shared motion curves — see the Animations section in .claude/rules/styling.md.
// Built-in easings are too weak for UI; never use ease-in on UI.

/** Entering / exiting elements and discrete state changes. */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

/** Elements moving or morphing on screen (list reflow, repositioning). */
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
