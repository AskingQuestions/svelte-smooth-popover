<script lang="ts">
	import Popover from '../src/lib/Popover.svelte';
	import type { Alignment } from '../src/lib/Popover.svelte';
	import { browser } from '$app/environment';
	import Graphic from '$lib/graphic.svelte';
	import { onDestroy, onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	let x = 0;
	let y = 0;

	let mouseX = 0;
	let mouseY = 0;
	let mouseIn = false;

	let popcommon = {
		showOnHover: true,
		borderRadius: 6,
		avoidOverlap: true,
		align: 'left-middle' as Alignment,
		class: 'bg-[#1c1c1c] rounded-md px-4 py-2 custom-popover',
		caretBg: '#1c1c1c'
	};

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function handleMouseEnter(e: MouseEvent) {
		console.log('enter');
		mouseIn = true;
	}

	function handleMouseLeave(e: MouseEvent) {
		console.log('leave');
		mouseIn = false;
	}

	let exampleBoxEl: HTMLElement;
	let graphicEl: HTMLElement;

	function calcExamplePos() {
		if (exampleBoxEl && graphicEl) {
			let rect = exampleBoxEl.getBoundingClientRect();
			x = rect.left + rect.width / 2 - 200 / 2;
			y = rect.top + rect.height / 2 - 104 / 2;

			if (!mouseIn) {
				graphicEl.style.top = `${y - 40 - custom.offset}px`;
				graphicEl.style.left = `${x + 200 / 2 - 40 / 2}px`;
				graphicEl.style.position = `fixed`;
				exampleBoxEl.style.cursor = `default`;
			} else {
				graphicEl.style.top = `${mouseY - 40 / 2 - 10}px`;
				graphicEl.style.left = `${mouseX - 40 / 2}px`;
				graphicEl.style.position = `fixed`;
				graphicEl.style.pointerEvents = `none`;
				exampleBoxEl.style.cursor = `grabbing`;
			}
		}
	}

	let componentTextEl: HTMLElement | null = null;

	let killFrameLoop = false;
	function animFrame() {
		if (killFrameLoop) return;
		requestAnimationFrame(animFrame);
		calcExamplePos();
	}

	onMount(() => {
		if (browser) {
			calcExamplePos();
			animFrame();
		}
	});

	onDestroy(() => {
		killFrameLoop = true;
	});

	let custom = {
		borderRadius: 10,
		caretWidth: 15,
		offset: 10,
		caretCurveAmount: 1,
		caretCurveTopAngle: -15,
		caretCurveTopStrength: 0.3333,
		caretCurveBottomAngle: 15,
		caretCurveBottomStrength: 0.6666,
		caretSubmerge: false,
		align: 'top-center' as Alignment,
		alignAnchor: 'auto' as Alignment
	};

	let customTrigger = {
		showOnHover: false,
		hideOnExternalClick: false,
		showOnClick: false,
		open: true
	};
</script>

<h1 class="text-center">
	Svelte
	<span style="font-family: monospace"
		><span>&lt;</span><span class="popover-anim"
			>Popover{#if browser}<Popover
					watchAnimations={true}
					constrainToWindow={false}
					collideWith={[componentTextEl]}
					caretCurveAmount={1}
					caretWidth={25}
					offset={10}
					borderRadius={8}
					><div class="bg-[white] text-[black] rounded-lg py-2 px-4">
						This is a Popover
					</div></Popover
				>{/if}</span
		><span>&gt;</span></span
	>
	<span bind:this={componentTextEl}>Component</span>
</h1>
<p class="text-center" style="margin-top: 12rem;">
	A robust unstyled popover component for Svelte.
</p>
<pre style="max-width: 20rem; text-align: center;" class="language-sh"><code class="language-sh"
		>$ <span class="token function">npm</span> i svelte-smooth-popover</code
	></pre>

{@html `<pre class="language-jsx"><code class="language-jsx"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  import { Popover } from 'svelte-smooth-popover';
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  Example
  </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Popover</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>shadow-sm bg-white<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    Popover content
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Popover</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span></code></pre>`}

<h2 class="text-2xl m-2">Caret customization</h2>

<div
	class=" flex flex-row bg-[rgb(18,19,20)] p-4 mt-2 mx-auto max-w-[55rem] min-h-[20rem] flex items-center justify-center relative"
>
	<div
		class="flex-1 flex items-center justify-center self-stretch"
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		on:mousemove={handleMouseMove}
	>
		<div bind:this={exampleBoxEl}>
			<button
				class="bg-gray min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md"
				bind:this={graphicEl}
			>
				<Graphic icon="info" />
				<Popover {...custom} caretBg="#464646" forcePosition={{ x: x, y: y }}>
					<div
						style="border-radius: {custom.borderRadius}px;"
						class="p-10 flex items-center justify-center min-w-[200px] bg-gray-bubble text-black"
					/>
				</Popover>
			</button>
		</div>
	</div>
	<div
		class="bg-gray rounded-lg top-4 right-4 bottom-4 min-w-[17rem] flex items-center flex-col self-stretch"
	>
		<div class="text-white self-start ml-2">
			&lt;<span class="text-[#4ec9b0]">Popover</span>
		</div>
		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="borderRadius">
			<Popover {...custom} {...popcommon}
				>Border radius used to calculate caret position
				<br /><i>This should be kept in sync with the border radius of the popover box </i>
			</Popover>
			<span class="text-[lightblue]">borderRadius</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.borderRadius}
			/>{'}'}
		</label>
		<input
			id="borderRadius"
			class="mt-4"
			type="range"
			min="0"
			max="40"
			step="1"
			bind:value={custom.borderRadius}
		/>

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="caretWidth">
			<Popover {...custom} {...popcommon}>Target width of the caret in pixels</Popover>
			<span class="text-[lightblue]">caretWidth</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.caretWidth}
			/>{'}'}
		</label>
		<input
			id="caretWidth"
			class="mt-4"
			type="range"
			min="1"
			max="120"
			step="1"
			bind:value={custom.caretWidth}
		/>

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="offset">
			<Popover {...custom} {...popcommon}>Distance in pixels between the popover and target</Popover
			>
			<span class="text-[lightblue]">offset</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.offset}
			/>{'}'}
		</label>
		<input
			id="offset"
			class="mt-4"
			type="range"
			min="1"
			max="50"
			step="1"
			bind:value={custom.offset}
		/>

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="caretCurveAmount">
			<Popover {...custom} {...popcommon}
				>Value between 0 and 1 which transitions from a sharp to a curved caret</Popover
			>
			<span class="text-[lightblue]">caretCurveAmount</span>={'{'}<input
				size="1"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.caretCurveAmount}
			/>{'}'}
		</label>
		<input
			id="caretCurveAmount"
			class="mt-4 w-8"
			type="range"
			min="0"
			max="1"
			step="1"
			bind:value={custom.caretCurveAmount}
		/>

		<label
			style="font-family: monospace"
			class="self-start ml-6 mt-2 -mb-2"
			for="caretCurveTopAngle"
		>
			<Popover {...custom} {...popcommon}>Adjust the top part of the caret's curve</Popover>
			<span class="text-[lightblue]">caretCurveTopAngle</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.caretCurveTopAngle}
			/>{'}'}
		</label>
		<input
			id="caretCurveTopAngle"
			class="mt-4"
			type="range"
			min="-45"
			max="45"
			step="1"
			bind:value={custom.caretCurveTopAngle}
		/>

		<label
			style="font-family: monospace"
			class="self-start ml-6 mt-2 -mb-2"
			for="caretCurveTopStrength"
		>
			<Popover {...custom} {...popcommon}
				>Extend the bezier handle of the top part of the caret's curve</Popover
			>
			<span class="text-[lightblue]">caretCurveTopStrength</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.caretCurveTopStrength}
			/>{'}'}
		</label>
		<input
			id="caretCurveTopStrength"
			class="mt-4"
			type="range"
			min="0"
			max="3"
			step="0.01"
			bind:value={custom.caretCurveTopStrength}
		/>

		<label
			style="font-family: monospace"
			class="self-start ml-6 mt-2 -mb-2"
			for="caretCurveBottomAngle"
		>
			<Popover {...custom} {...popcommon}>Adjust the bottom part of the caret's curve</Popover>
			<span class="text-[lightblue]">caretCurveBottomAngle</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.caretCurveBottomAngle}
			/>{'}'}
		</label>
		<input
			id="caretCurveBottomAngle"
			class="mt-4"
			type="range"
			min="-45"
			max="45"
			step="1"
			bind:value={custom.caretCurveBottomAngle}
		/>

		<label
			style="font-family: monospace"
			class="self-start ml-6 mt-2 -mb-2"
			for="caretCurveBottomStrength"
		>
			<Popover {...custom} {...popcommon}
				>Extend the bezier handle of the bottom part of the caret's curve</Popover
			>
			<span class="text-[lightblue]">caretCurveBottomStrength</span>={'{'}<input
				size="3"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.caretCurveBottomStrength}
			/>{'}'}
		</label>
		<input
			id="caretCurveBottomStrength"
			class="mt-4"
			type="range"
			min="0"
			max="3"
			step="0.01"
			bind:value={custom.caretCurveBottomStrength}
		/>

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="caretSubmerge">
			<Popover {...custom} {...popcommon}
				>Should the caret "submerge" (hide) when it nears a corner?</Popover
			>
			<span class="text-[lightblue]">caretSubmerge</span>={`{${custom.caretSubmerge}}`}
		</label>
		<input id="caretSubmerge" class="mt-4" type="checkbox" bind:checked={custom.caretSubmerge} />
		<div class="text-white self-start ml-6">/&gt;</div>
	</div>
</div>

<h2 class="text-2xl" style="margin-top: 2rem">Alignment</h2>

<div
	class=" flex flex-row bg-[rgb(18,19,20)] p-4 mt-2 mx-auto max-w-[55rem] min-h-[27rem] flex items-center justify-center relative"
>
	<div class="flex-1 flex items-center justify-center self-stretch">
		<div>
			<button
				class="bg-gray min-w-[120px] min-h-[150px] flex items-center justify-center rounded-md"
			>
				<Graphic icon="info" />
				<Popover {...custom} caretBg="#464646" constrainToWindow={true}>
					<div
						style="border-radius: {custom.borderRadius}px;"
						class="p-10 flex items-center justify-center min-w-[200px] bg-gray-bubble text-black"
					/>
				</Popover>
			</button>
		</div>
	</div>
	<div
		class="bg-gray rounded-lg top-4 right-4 bottom-4 min-w-[17rem] flex items-center flex-col self-stretch"
	>
		<div class="text-white self-start ml-2">
			&lt;<span class="text-[#4ec9b0]">Popover</span>
		</div>
		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="align">
			<Popover {...custom} {...popcommon}
				>Two-step alignment of the popover (first-second)<br />
				<i
					>The first step applies the alignment with an offset, while the second part aligns the
					off-axis without any offset</i
				></Popover
			>
			<span class="text-[lightblue]">align</span>={'{'}<span class="text-[orange]">"</span><input
				size="16"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.align}
			/><span class="text-[orange]">"</span>{'}'}
		</label>
		<select id="align" class="mt-4" bind:value={custom.align}>
			<optgroup label="Basic">
				<option>top-center</option>
				<option>bottom-center</option>
				<option>left-middle</option>
				<option>right-middle</option>
			</optgroup>
			<optgroup label="Vertical left/right">
				<option>top-left</option>
				<option>top-right</option>
				<option>bottom-left</option>
				<option>bottom-right</option>
			</optgroup>

			<optgroup label="Horizontal top/bottom">
				<option>left-top</option>
				<option>left-bottom</option>
				<option>right-top</option>
				<option>right-bottom</option>
			</optgroup>
		</select>

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="alignAnchor">
			<Popover {...custom} {...popcommon}>Two-step alignment of the anchor target</Popover>
			<span class="text-[lightblue]">alignAnchor</span>={'{'}<span class="text-[orange]">"</span
			><input
				size="16"
				class="text-[orange] bg-[transparent] text-center"
				bind:value={custom.alignAnchor}
			/><span class="text-[orange]">"</span>{'}'}
		</label>
		<select id="alignAnchor" class="mt-4" bind:value={custom.alignAnchor}>
			<optgroup label="Basic">
				<option>auto</option>
				<option>top-center</option>
				<option>bottom-center</option>
				<option>left-middle</option>
				<option>right-middle</option>
			</optgroup>
			<optgroup label="Vertical left/right">
				<option>top-left</option>
				<option>top-right</option>
				<option>bottom-left</option>
				<option>bottom-right</option>
			</optgroup>

			<optgroup label="Horizontal top/bottom">
				<option>left-top</option>
				<option>left-bottom</option>
				<option>right-top</option>
				<option>right-bottom</option>
			</optgroup>
		</select>
		<div class="text-white self-start ml-6">/&gt;</div>
	</div>
</div>

<h2 class="text-2xl" style="margin-top: 2rem">Triggers</h2>

<div
	class=" flex flex-row bg-[rgb(18,19,20)] p-4 mt-2 mx-auto max-w-[55rem] min-h-[27rem] flex items-center justify-center relative"
>
	<div class="flex-1 flex items-center justify-center self-stretch">
		<div>
			<button
				class="bg-gray min-w-[120px] min-h-[150px] flex items-center justify-center rounded-md"
			>
				<Graphic icon="info" />
				<Popover {...custom} {...customTrigger} caretBg="#464646" constrainToWindow={true}>
					<div
						style="border-radius: {custom.borderRadius}px;"
						class="p-10 flex items-center justify-center min-w-[200px] bg-gray-bubble text-black"
					/>
				</Popover>
			</button>
		</div>
	</div>
	<div
		class="bg-gray rounded-lg top-4 right-4 bottom-4 min-w-[17rem] flex items-center flex-col self-stretch"
	>
		<div class="text-white self-start ml-2">
			&lt;<span class="text-[#4ec9b0]">Popover</span>
		</div>
		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="open">
			<Popover {...custom} {...popcommon}>Simple show/hide</Popover>
			<span class="text-[lightblue]">open</span>={`{${customTrigger.open}}`}
		</label>
		<input id="open" class="mt-4" type="checkbox" bind:checked={customTrigger.open} />

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="showOnHover">
			<Popover {...custom} {...popcommon}
				>Should the popover show when hovering over the anchor?</Popover
			>
			<span class="text-[lightblue]">showOnHover</span>={`{${customTrigger.showOnHover}}`}
		</label>
		<input id="showOnHover" class="mt-4" type="checkbox" bind:checked={customTrigger.showOnHover} />

		<label style="font-family: monospace" class="self-start ml-6 mt-2 -mb-2" for="showOnClick">
			<Popover {...custom} {...popcommon}
				>Should the popover toggle when clicking the anchor?</Popover
			>
			<span class="text-[lightblue]">showOnClick</span>={`{${customTrigger.showOnClick}}`}
		</label>
		<input id="showOnClick" class="mt-4" type="checkbox" bind:checked={customTrigger.showOnClick} />

		<label
			style="font-family: monospace"
			class="self-start ml-6 mt-2 -mb-2"
			for="hideOnExternalClick"
		>
			<Popover {...custom} {...popcommon}
				>Should the popover hide when clicking outside the anchor and popover?</Popover
			>
			<span class="text-[lightblue]">hideOnExternalClick</span
			>={`{${customTrigger.hideOnExternalClick}}`}
		</label>
		<input
			id="hideOnExternalClick"
			class="mt-4"
			type="checkbox"
			bind:checked={customTrigger.hideOnExternalClick}
		/>

		<div class="text-white self-start ml-6">/&gt;</div>
	</div>
</div>

<style>
	:root {
		--popover-z-index: 10;
	}

	.popover-anim:hover {
		animation: anim-2 alternate 1s ease-in-out infinite;
		color: var(--primary);
		cursor: default;
		position: relative;
	}

	@keyframes anim-2 {
		0% {
			margin: 0px 0px;
			left: 0px;
		}
		50% {
			margin: 0px 20px;
			left: -20px;
		}
		100% {
			margin: 0px 20px;
			left: 20px;
		}
	}

	:global(.custom-popover) {
		box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
		outline: 1px solid #4ec9b0;
	}
	:global(.custom-popover use) {
		stroke: #4ec9b0;
		stroke-width: 2px;
		paint-order: stroke;
	}
</style>
