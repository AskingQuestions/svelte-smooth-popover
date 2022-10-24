---
title: Svelte Popover Component
---

<script>
	import Index from "./index.svelte";
</script>

<Index />

<br>
<br>

### All props

````ts
/**
 * The alignment relative to the popover
 */
export let align: Alignment = 'bottom-center';

/**
 * The alignment relative to the anchor
 */
export let alignAnchor: Alignment | 'auto' = 'auto';

/**
 * Offset to apply to the popover relative to the anchor
 */
export let offset = 5;

/**
 * Target width of the caret
 */
export let caretWidth = 15;

/**
 * Target height of the caret. Default: offset - 2px
 */
export let caretHeight: number | null = null;

export let caretBg = 'white';

export let caretCurveAmount = 0;

export let caretCurveTopAngle = -15;
export let caretCurveTopStrength = 0.3333;

export let caretCurveBottomAngle = 15;
export let caretCurveBottomStrength = 0.6666;

export let forcePosition: { x: 0; y: 0 } | null = null;

/**
 * Show the popover on hover?
 */
export let showOnHover = false;

/**
 * Should the popover hide when the user clicks outside of the popover or anchor?
 */
export let hideOnExternalClick = false;

/**
 * Show the popover on anchor click?
 */
export let showOnClick = false;

/**
 * Basic {#if} to show/hide the popover
 */
export let open = true;

/**
 * Svelte transtion to use when showing/hiding the popover
 */
export let transition: any = null;

/**
 * Should the popover react to css animations/transitions?
 *
 * If enabled, the popover will register an Animation frame loop to check for changes in size or position. This may add some additional overhead.
 */
export let watchAnimations = false;

/**
 * Should the popover move to stay within the window bounds?
 */
export let constrainToWindow = true;

/**
 * Should the popover avoid overlapping the anchor?
 */
export let avoidOverlap = true;

/**
 * Elements that the popover should try and not overlap
 */
export let collideWith: (HTMLElement | null)[] = [];

/**
 * Should the caret "submerge" (hide) when it nears a corner?
 */
export let caretSubmerge = false;

/**
 * Number of steps to take around corners. Increase/decrease this if you notice cracks between the caret and the popover
 */
export let caretResolution = 0;

/**
 * Set this to the border-radius of the main popover background element.
 *
 * This is used to calculate positioning and clipping for the caret around corners.
 */
export let borderRadius = 6.75;

/**
 * Distance to maintain from the edge of the window
 */
export let windowMargin = 10;

/**
 * Override the z-index of the popover
 *
 * Note: You can also apply a custom z-index globally by setting the `--popover-z-index` css variable in :root {}
 *
 * e.g.
 * ```css
 * :root {
 * 	--popover-z-index: 1000;
 * }
 * ```
 */
export let zIndex = '';
````
