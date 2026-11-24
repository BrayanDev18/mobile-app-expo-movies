---
paths:
  - "src/**/*.tsx"
---

# Styling

Use NativeWind (Tailwind CSS for RN) via `className` prop — not inline `style` objects (except for animations/dynamic values). Prettier sorts Tailwind classes via `prettier-plugin-tailwindcss`.

## Design Identity

Cinematic, dark-first, minimalist premium aesthetic. Photography is the hero — UI supports it, never competes. Depth comes from blur and overlays, not shadows. Motion is restrained and purposeful: instant for frequent actions, short ease-out for entrances, springs only when a finger drives it. Every screen should feel spacious and high-contrast.

## Color System

- **Backgrounds**: `neutral-900` base. Never pure black — use `dark-600`/`dark-700`/`dark-800` tokens for layered depth
- **Text primary**: pure `white`. Secondary: `!text-neutral-400`. Dimmed: `text-white/60`
- **Accent**: `blue-500` (`#3B82F6` / `light-700`) for interactive elements. `blue-400` for links
- **Red**: only for age ratings or critical indicators — never decorative
- **Overlays**: always `rgba(0,0,0,0.3–0.9)` — never solid black fills
- **Borders/dividers**: `border-white/10` to `border-white/30` — subtle, never heavy
- **Interactive highlight**: `rgba(59, 130, 246, 0.15)` (blue at 15% opacity)

## Spacing

- Between major sections: `gap-8` (32px)
- Between components within sections: `gap-4` to `gap-6`
- Inside cards/containers: `p-2` to `p-4`
- Card text stacks: `gap-0.5` to `gap-1` (tight)
- Horizontal list item separators: 12–16px width
- Screen horizontal padding: `px-3` to `px-4`
- Scrollable content bottom: `paddingBottom: bottom + 80` (safe area + tab bar clearance)
- Top padding on tab screens: `paddingTop: top + 15`

## Typography

| Role | Classes |
|------|---------|
| Section header | `!text-lg font-bold` (18px) |
| Movie title (detail) | `!text-2xl font-bold leading-tight` with `numberOfLines={2}` |
| Cast/actor name | `!text-3xl font-bold` |
| Card title | `!text-md font-semibold` with `numberOfLines={1}` |
| Body/description | `!text-md` with `!text-neutral-400` for secondary |
| Small labels/dates | `!text-[13px]` or `text-sm` with `!text-neutral-400` |
| Micro text (badges) | `text-xs font-semibold` |

Always set `numberOfLines` on titles to prevent overflow.

## Border Radius

- Screen content wrappers: `rounded-3xl` (24px)
- Cards, review containers, provider cards: `rounded-2xl` (16px)
- Image cards: top corners only — `borderTopLeftRadius: 10, borderTopRightRadius: 10`
- Buttons, tabs, badges: `rounded-full` (pill)
- Small icon containers: `rounded-xl`

## Images

- Always use `cachePolicy="memory-disk"` on `<Image>`
- Always set `contentFit` explicitly: `"fill"` (most common), `"cover"` (cast/gallery), `"contain"` (logos)
- Hero/backdrop images: full-screen with `blurRadius={20–50}`
- Poster cards: ~170×220px, top corners rounded
- Backdrop cards: ~300px wide, `aspectRatio: 1.78` (16:9)
- Cast portraits: 140×140 `borderRadius: 500` (circle)
- Gallery items: 280px wide, `aspectRatio: 1.78`, `borderRadius: 12`

## Gradients & Blur (Depth System)

No traditional shadows/elevation. Depth is achieved through:

- **LinearGradient overlays** on hero images: `colors={['transparent', 'rgba(0,0,0,0.8–0.9)']}`
- **BlurView** for floating UI and cards:
  - Heavy: `intensity={80}` (tab bar, navigation)
  - Medium: `intensity={50}` (provider cards, overlays)
  - Light: `intensity={40}` (back button)
  - Tint: `"dark"`, `"systemChromeMaterialDark"`, or `"light"` (back button only)
- Dark overlay containers: `backgroundColor: 'rgba(0,0,0,0.3–0.6)'` with `borderRadius`

## Animations

Decide whether something should animate before deciding how. Full rule catalog: `.claude/skills/review-animations/STANDARDS.md` (web-oriented) and the `expo:expo-animation` skill (React Native).

- **Gate by frequency**: tab, scope, chip and filter switches (100+/day) get **no** animation — swap the content instantly. Never put `entering` on a view keyed by a tab/scope value; a `key` used only to reset scroll/state is fine.
- **Curves**: `EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1)` for entering/exiting, `EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1)` for on-screen movement. Never ease-in on UI. UI animations stay under 300ms.
- **Discrete state changes** (tab highlight, toggles, press feedback): `withTiming` 150–200ms with `EASE_OUT` (press feedback 100–150ms) — not a spring.
- **Springs only when a finger carries momentum** (drag, fling, release), in the `{ duration, dampingRatio }` form: `{ duration: 400, dampingRatio: 0.8, velocity }` for snap-back, `{ duration: 300, dampingRatio: 0.8, velocity }` for sheets.
- **Entrances** (occasional: a screen's first load, modals, empty → content): `FadeIn` / `FadeInDown` with `.duration(250–300).easing(EASE_OUT)` — not `.springify()`. Staggers 30–80ms per item, capped at ~8 items.
- **Scroll-driven**: `useAnimatedScrollHandler` + `interpolate` for carousel scale (0.85→1→0.85), rotation (±8°), parallax (±20px). Put `translate` first in the transform array. When `useReducedMotion()` is true, flatten movement and keep opacity.
- **No continuous/looping animations** other than loaders — per-frame work overheated devices.
- **Carousels**: `snapToInterval={WIDTH + SPACING}`, `decelerationRate="fast"`
- Always use `scrollEventThrottle={16}`
- Use React Native Reanimated — never `Animated` from react-native

## Cards

```
// Movie card pattern
<Pressable onPress={...}>
  <View>
    <Image (top corners rounded, contentFit="fill", cachePolicy="memory-disk") />
    {ratingBadge && <View style={{position: 'absolute', top-right}} />}
  </View>
  <View className="gap-0.5 p-2.5">
    <Text numberOfLines={1} (title) />
    <Text className="!text-neutral-400" (date/subtitle) />
  </View>
</Pressable>

// Review/provider card pattern
<View style={{width: 170–300, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}} className="rounded-2xl p-4 gap-4">
  <BlurView intensity={50} tint="dark" />
  ...content
</View>
```

## Interactive Elements

- **Primary button**: `LinearGradient colors={['#68BEF1', '#2563EB']}` horizontal, height 48px, `rounded-full`
- **Tab active**: `bg-[rgba(59,130,246,0.15)]` with `text-blue-500`, `rounded-full`
- **Tab inactive**: transparent bg, `text-neutral-400`
- **Chevron/See All**: `TouchableHighlight underlayColor="#404040"` with `h-12 w-12 rounded-full items-center justify-center`

## Screen Composition

```
<Screen safeAreaEdges={[...]} canGoBack={bool} preset="scroll|fixed|auto">
  {/* For detail screens with hero image: */}
  <View (absolute full-screen background image with blurRadius) />
  <LinearGradient (absolute overlay) />
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{paddingBottom: bottom + 80}}>
      <View className="gap-8">
        ...sections
      </View>
    </View>
  </ScrollView>
</Screen>
```

## Lists

- Horizontal: `<FlashList horizontal showsHorizontalScrollIndicator={false} />` with `ItemSeparatorComponent` (12–16px spacer)
- Grid: `<FlashList numColumns={3} />` with `m-1` on items
- Always hide scroll indicators
