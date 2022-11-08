<script lang="ts" context="module">
	type PrimaryAlignment = 'top' | 'bottom' | 'left' | 'right';
	type SecondaryAlignment = PrimaryAlignment | 'center' | 'middle';
	export type Alignment =
		| `${PrimaryAlignment}-${SecondaryAlignment}`
		| 'center-middle'
		| 'middle-center';

	type Rect = { left: number; top: number; width: number; height: number };
</script>

<script lang="ts">
	import { onDestroy, onMount, tick, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function mount(node: HTMLElement) {
		const host = document.body;
		host.insertBefore(node, null);
		return () => host.contains(node) && host.removeChild(node);
	}
	function portal(node: HTMLElement) {
		let destroy = mount(node);
		return { destroy: () => destroy?.() };
	}

	let uid = 0;
	if (typeof window !== 'undefined') {
		uid = (window as any).popover_uid = ((window as any).popover_uid || 0) + 1;
		(window as any).popover_uid++;
	}

	const ALIGN_OPOSITES: { [key: string]: string } = {
		auto: 'auto',
		top: 'bottom',
		middle: 'middle',
		bottom: 'top',
		left: 'right',
		center: 'center',
		right: 'left'
	};

	/**
	 * The alignment relative to the popover
	 */
	export let align: Alignment = 'bottom-center';

	/**
	 * The alignment relative to the anchor
	 */
	export let alignAnchor: Alignment | 'auto' = 'auto';

	// If the user chooses not to set alignAnchor we'll calculate it by flipping the align prop
	$: alignAnchorReal =
		alignAnchor == 'auto'
			? align
					.split('-')
					.map((v, i) => (i == 0 ? ALIGN_OPOSITES[v] : v))
					.join('-')
			: alignAnchor;

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

	$: caretHeightReal = caretHeight ? caretHeight : offset - 2;

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

	let hoverOpen = false;

	/**
	 * Should the popover hide when the user clicks outside of the popover or anchor?
	 */
	export let hideOnExternalClick = false;

	/**
	 * Show the popover on anchor click?
	 */
	export let showOnClick = false;

	let clickOpen = false;

	/**
	 * Basic {#if} to show/hide the popover
	 */
	export let open = true;

	$: openReal = showOnClick || showOnHover ? hoverOpen || clickOpen : open;

	/**
	 * Svelte transtion to use when showing/hiding the popover
	 */
	export let transition: any = null;

	function transitionFn(node: HTMLElement, params: any) {
		if (transition) {
			return transition(node, params);
		} else {
			return null;
		}
	}

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

	/**
	 * Switch to use "fixed" positioning if your popover is not working right
	 */
	export let useFixedPositioning = false;

	$: {
		caretBg,
			caretCurveAmount,
			caretCurveTopAngle,
			caretCurveTopStrength,
			caretCurveBottomAngle,
			caretCurveBottomStrength,
			borderRadius,
			caretWidth,
			caretHeightReal,
			offset,
			align,
			alignAnchorReal,
			constrainToWindow,
			avoidOverlap,
			collideWith,
			watchAnimations,
			windowMargin,
			forcePosition,
			caretSubmerge,
			open,
			showOnHover,
			showOnClick,
			zIndex;

		calcPosition(true);
	}

	let mutationObserver: MutationObserver;
	let resizeObserver: ResizeObserver;

	let dropdownPointerClass = '';

	let parentEl: HTMLElement | null;
	let dropdownEl: HTMLElement;
	let dropdownPointerRectMaskEl: SVGPathElement;
	let dropdownPointerRectMaskFullEl: SVGPathElement;
	let dropdownPointerRectEl: SVGPathElement;
	let dropdownPointerEl: HTMLElement | SVGElement;
	let dropdownPointerPathEl: SVGPathElement;
	let dropdownPointerRectPathEl: SVGPathElement;
	let childSlotEl: HTMLElement;

	let interestRects: Map<HTMLElement, Rect> = new Map();

	$: interests = [...collideWith, parentEl, dropdownEl];

	function observeInterests() {
		for (let col of interests) {
			if (col) {
				mutationObserver.observe(col, {
					attributes: true,
					childList: true,
					subtree: true
				});
				resizeObserver.observe(col);
			}
		}
	}

	$: {
		interests;
		if (mutationObserver && resizeObserver) {
			observeInterests();
		}
	}

	function getFlooredBoundingClientRect(el: HTMLElement) {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height
		};
	}

	function placeAlignment(to: Alignment, rect: Rect, alignOverflow: number = offset / 2) {
		let x = 0;
		let y = 0;

		let [alignFirst, alignLast] = to.split('-');

		let apply = (alignTo: string, overflow = 0) => {
			switch (alignTo) {
				case 'right':
					x = rect.left - overflow;
					break;
				case 'center':
					x = rect.left + rect.width / 2;
					break;
				case 'left':
					x = rect.left + rect.width + overflow;
					break;
				case 'bottom':
					y = rect.top - overflow;
					break;
				case 'middle':
					y = rect.top + rect.height / 2;
					break;
				case 'top':
					y = rect.top + rect.height + overflow;
					break;
			}
		};

		apply(alignFirst, alignOverflow);
		apply(alignLast, 0);

		return { x, y };
	}

	function rectsEqual(a: Rect, b: Rect) {
		return a.left == b.left && a.top == b.top && a.width == b.width && a.height == b.height;
	}

	function calcPosition(force = false) {
		if (!parentEl || !dropdownEl) return;

		let anchorRect = getFlooredBoundingClientRect(parentEl);
		let popRect = getFlooredBoundingClientRect(dropdownEl);

		let anyInterestChanged = false;
		for (let interest of interests) {
			if (interest) {
				let rect = interest.getBoundingClientRect();
				if (
					!interestRects.has(interest) ||
					!rectsEqual(interestRects.get(interest) || { left: 0, top: 0, width: 0, height: 0 }, rect)
				) {
					anyInterestChanged = true;
					interestRects.set(interest, rect);
				}
			}
		}

		if (!anyInterestChanged && !force) return;

		let targetAnchor = placeAlignment(alignAnchorReal as Alignment, anchorRect);
		let targetPop = placeAlignment(align, popRect);

		let x = targetAnchor.x + (popRect.left - targetPop.x);
		let y = targetAnchor.y + (popRect.top - targetPop.y);

		function solveContain(rect: Rect) {
			if (x < rect.left) {
				x = Math.min(rect.left, anchorRect.left + anchorRect.width);
			} else if (x + popRect.width > rect.left + rect.width) {
				x = Math.max(rect.left + rect.width - popRect.width, anchorRect.left - popRect.width);
			}

			if (y < rect.top) {
				y = Math.min(rect.top, anchorRect.top + anchorRect.height);
			} else if (y + popRect.height > rect.top + rect.height) {
				y = Math.max(rect.top + rect.height - popRect.height, anchorRect.top - popRect.height);
			}
		}

		function solveCollision(rect: Rect, axis = 'x' || 'y') {
			// AABB collision detection
			if (
				x < rect.left + rect.width &&
				x + popRect.width > rect.left &&
				y < rect.top + rect.height &&
				y + popRect.height > rect.top
			) {
				if (axis == 'x') {
					if (x < rect.left) {
						x = rect.left - popRect.width;
					} else if (x + popRect.width > rect.left + rect.width) {
						x = rect.left + rect.width + offset / 2;
					}
				} else if (axis == 'y') {
					if (y < rect.top + rect.height) {
						y = rect.top - popRect.height;
						if (y < offset) {
							y = rect.top + rect.height + offset / 2;
						}
					} else if (y + popRect.height > rect.top + rect.height) {
						y = rect.top + rect.height;
					}
				}
			}
		}

		let windowRect = {
			left: windowMargin,
			top: windowMargin,
			width: window.innerWidth - windowMargin * 2,
			height: window.innerHeight - windowMargin * 2
		};

		let anchorRectWithOffset = {
			left: anchorRect.left - offset / 2,
			top: anchorRect.top - offset / 2,
			width: anchorRect.width + (offset / 2) * 2,
			height: anchorRect.height + (offset / 2) * 2
		};

		if (constrainToWindow) solveContain(windowRect);

		if (avoidOverlap) solveCollision(anchorRectWithOffset, 'y');

		for (let col of collideWith) {
			if (col) solveCollision(col.getBoundingClientRect(), 'y');
		}

		if (constrainToWindow) solveContain(windowRect);

		if (avoidOverlap) solveCollision(anchorRectWithOffset, 'x');

		for (let col of collideWith) {
			if (col) solveCollision(col.getBoundingClientRect(), 'x');
		}

		if (constrainToWindow) solveContain(windowRect);

		if (forcePosition) {
			x = Math.floor(forcePosition.x);
			y = Math.floor(forcePosition.y);
		}

		if (useFixedPositioning) {
			dropdownEl.style.left = `${x}px`;
			dropdownEl.style.top = `${y}px`;
		} else {
			dropdownEl.style.left = `${x + window.scrollX}px`;
			dropdownEl.style.top = `${y + window.scrollY}px`;
		}

		if (zIndex != '') {
			dropdownEl.style.setProperty('--popover-z-index', zIndex);
		}

		let newDropRect = getFlooredBoundingClientRect(dropdownEl);

		let br = Math.min(borderRadius, newDropRect.width / 2 - 1, newDropRect.height / 2 - 1);

		dropdownPointerRectEl?.setAttribute('x', `0px`);
		dropdownPointerRectEl?.setAttribute('y', `0px`);
		dropdownPointerRectEl?.setAttribute('width', `${newDropRect.width}px`);
		dropdownPointerRectEl?.setAttribute('height', `${newDropRect.height}px`);
		dropdownPointerRectEl?.setAttribute('rx', `${br}px`);
		dropdownPointerRectMaskEl?.setAttribute('x', `0px`);
		dropdownPointerRectMaskEl?.setAttribute('y', `0px`);
		dropdownPointerRectMaskEl?.setAttribute('width', `${newDropRect.width}px`);
		dropdownPointerRectMaskEl?.setAttribute('height', `${newDropRect.height}px`);
		dropdownPointerRectMaskEl?.setAttribute('rx', `${br}px`);
		dropdownPointerRectMaskFullEl?.setAttribute('x', `-${offset}px`);
		dropdownPointerRectMaskFullEl?.setAttribute('y', `-${offset}px`);
		dropdownPointerRectMaskFullEl?.setAttribute('width', `${newDropRect.width + offset * 2}px`);
		dropdownPointerRectMaskFullEl?.setAttribute('height', `${newDropRect.height + offset * 2}px`);

		// Create rounded rectangle for pointer
		br = Math.min(borderRadius + 1, newDropRect.width / 2, newDropRect.height / 2);
		const top = newDropRect.width - br * 2;
		const right = newDropRect.height - br * 2;
		const bottom = newDropRect.width - br * 2;
		const left = newDropRect.height - br * 2;
		let off = offset * 4;
		dropdownPointerRectPathEl?.setAttribute(
			'd',
			`
			
			M${br},0
        h${top}
        a${br},${br} 0 0 1 ${br},${br}
        v${right}
        a${br},${br} 0 0 1 -${br},${br}
        h-${bottom}
        a${br},${br} 0 0 1 -${br},-${br}
        v-${left}
        a${br},${br} 0 0 1 ${br},-${br}
				M${-off},${-off}
				L${-off},${-off}
				L${-off},${newDropRect.height + off}
				L${newDropRect.width + off},${newDropRect.height + off}
				L${newDropRect.width + off},${-off}
				M${-off},${-off}
        z
			`
		);

		calcPointer(newDropRect, anchorRect);
	}

	function calcPointer(dropRect: Rect, anchorRect: Rect) {
		// Find line between the two cloest points
		let x1 = 0;
		let x2 = 0;
		if (dropRect.left + dropRect.width < anchorRect.left) {
			x1 = dropRect.left + dropRect.width;
			x2 = anchorRect.left;
		} else if (dropRect.left > anchorRect.left + anchorRect.width) {
			x1 = dropRect.left;
			x2 = anchorRect.left + anchorRect.width;
		} else {
			// Calculate midpoint on intersection
			let minX = Math.max(dropRect.left, anchorRect.left);
			let maxX = Math.min(dropRect.left + dropRect.width, anchorRect.left + anchorRect.width);
			x1 = (minX + maxX) / 2;
			x2 = x1;
		}

		let y1 = 0;
		let y2 = 0;
		if (dropRect.top + dropRect.height < anchorRect.top) {
			y1 = dropRect.top + dropRect.height;
			y2 = anchorRect.top;
		} else if (dropRect.top > anchorRect.top + anchorRect.height) {
			y1 = dropRect.top;
			y2 = anchorRect.top + anchorRect.height;
		} else {
			// Calculate midpoint on intersection
			let minY = Math.max(dropRect.top, anchorRect.top);
			let maxY = Math.min(dropRect.top + dropRect.height, anchorRect.top + anchorRect.height);
			y1 = (minY + maxY) / 2;
			y2 = y1;
		}

		function lengthToBoxPoint(v: number) {
			let rect = dropdownPointerRectEl;
			if (!rect) return { x: 0, y: 0 };
			let len = 0;
			try {
				len = rect.getTotalLength();
			} catch (e) {
				return { x: 0, y: 0 };
			}

			v = v % len;
			if (v < 0) v += len;
			// With border radius
			return rect.getPointAtLength(v) || { x: 0, y: 0 };
		}

		function boxPointToLength(p: { x: number; y: number }) {
			let rect = dropdownPointerRectEl;
			if (!rect) return 0;
			let resolution = 20;

			let min = Infinity;
			let closestPoint = 0;
			let len = 0;
			try {
				len = rect.getTotalLength();
			} catch (e) {
				return 0;
			}

			for (let i = 0; i < resolution; i++) {
				let p2 = rect.getPointAtLength((i / resolution) * len);
				let dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
				if (dist < min) {
					min = dist;
					closestPoint = (i / resolution) * len;
				}
			}

			let maxIter = 10;
			while (min > 0.1 && maxIter-- > 0) {
				let p2 = rect.getPointAtLength(closestPoint - min / 2);
				let p3 = rect.getPointAtLength(closestPoint + min / 2);
				let d1 = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
				let d2 = Math.sqrt((p.x - p3.x) ** 2 + (p.y - p3.y) ** 2);
				if (d1 < d2) {
					closestPoint -= min / 2;
					min = d1;
				} else {
					closestPoint += min / 2;
					min = d2;
				}

				closestPoint = closestPoint % len;
				if (closestPoint < 0) closestPoint += len;
			}

			return closestPoint;
		}

		let len = boxPointToLength({ x: x1 - dropRect.left, y: y1 - dropRect.top });
		let p1 = lengthToBoxPoint(len - caretWidth);
		let p2 = lengthToBoxPoint(len + caretWidth);
		let pM = lengthToBoxPoint(len);
		let p3 = { x: p1.x - p2.x, y: p1.y - p2.y };
		let pMtoAnchor = { x: x2 - dropRect.left - pM.x, y: y2 - dropRect.top - pM.y };
		//normalize
		let p3len = Math.sqrt(p3.x ** 2 + p3.y ** 2);
		p3.x /= p3len;
		p3.y /= p3len;

		let pMtoAnchorLen = Math.sqrt(pMtoAnchor.x ** 2 + pMtoAnchor.y ** 2);
		pMtoAnchor.x /= pMtoAnchorLen;
		pMtoAnchor.y /= pMtoAnchorLen;

		// Get perpendicular
		let p4 = { x: -p3.y, y: p3.x };
		let pmid = { x: 0, y: 0 };
		if (caretSubmerge) {
			pmid = {
				x: (p1.x + p2.x) / 2 + p4.x * caretHeightReal,
				y: (p1.y + p2.y) / 2 + p4.y * caretHeightReal
			};
		} else {
			pmid = {
				x: pM.x + pMtoAnchor.x * caretHeightReal,
				y: pM.y + pMtoAnchor.y * caretHeightReal
			};
		}

		let curveAngleTopRad = caretCurveTopAngle * (Math.PI / 180) * caretCurveAmount;
		let curveAngleBotRad = caretCurveBottomAngle * (Math.PI / 180) * caretCurveAmount;
		let angleLeft = Math.atan2(p1.y - pmid.y, p1.x - pmid.x);
		let angleRight = Math.atan2(p2.y - pmid.y, p2.x - pmid.x);
		let handleTopLeft = {
			x:
				pmid.x +
				Math.cos(angleLeft - curveAngleTopRad) *
					caretCurveTopStrength *
					caretWidth *
					caretCurveAmount,
			y:
				pmid.y +
				Math.sin(angleLeft - curveAngleTopRad) *
					caretCurveTopStrength *
					caretWidth *
					caretCurveAmount
		};
		let handleTopRight = {
			x:
				pmid.x +
				Math.cos(angleRight + curveAngleTopRad) *
					caretCurveTopStrength *
					caretWidth *
					caretCurveAmount,
			y:
				pmid.y +
				Math.sin(angleRight + curveAngleTopRad) *
					caretCurveTopStrength *
					caretWidth *
					caretCurveAmount
		};
		let handleBotLeft = {
			x:
				p1.x +
				Math.cos(Math.PI + angleLeft + curveAngleBotRad) *
					caretCurveBottomStrength *
					caretWidth *
					caretCurveAmount,
			y:
				p1.y +
				Math.sin(Math.PI + angleLeft + curveAngleBotRad) *
					caretCurveBottomStrength *
					caretWidth *
					caretCurveAmount
		};
		let handleBotRight = {
			x:
				p2.x +
				Math.cos(Math.PI + angleRight - curveAngleBotRad) *
					caretCurveBottomStrength *
					caretWidth *
					caretCurveAmount,
			y:
				p2.y +
				Math.sin(Math.PI + angleRight - curveAngleBotRad) *
					caretCurveBottomStrength *
					caretWidth *
					caretCurveAmount
		};

		let caretStops = [];
		for (let i = 0; i < caretResolution; i++) {
			let p = lengthToBoxPoint(len - caretWidth + (i / caretResolution) * caretWidth * 2);
			caretStops.push(p);
		}
		let allX = [p1.x, p2.x, x1, x2];
		let allY = [p1.y, p2.y, y1, y2];

		dropdownPointerEl.style.left = `0px`;
		dropdownPointerEl.style.top = `0px`;
		dropdownPointerEl.setAttribute('width', `${dropRect.width}px`);
		dropdownPointerEl.setAttribute('height', `${dropRect.height}px`);
		dropdownPointerEl.setAttribute('viewBox', `0 0 ${dropRect.width} ${dropRect.height}`);

		dropdownPointerPathEl?.setAttribute(
			'd',
			` M${p1.x} ${p1.y}
				${caretStops.map((x) => `L${x.x} ${x.y}`).join(' ')}
				L${p2.x} ${p2.y}
				C${handleBotRight.x} ${handleBotRight.y},${handleTopRight.x} ${handleTopRight.y},${pmid.x} ${pmid.y}
				C${handleTopLeft.x} ${handleTopLeft.y},${handleBotLeft.x} ${handleBotLeft.y},${p1.x} ${p1.y}
				`
		);
	}

	function handleParentMouseEnter() {
		if (showOnHover) {
			hoverOpen = true;
			dispatch('open');
		}
	}

	function handleParentMouseLeave() {
		if (showOnHover) {
			hoverOpen = false;
			dispatch('open');
		}
	}

	function handleParentMouseClick() {
		if (showOnClick) {
			clickOpen = !clickOpen;
			clickOpen ? dispatch('open') : dispatch('close');
		}
	}

	function isElementInPopover(el: HTMLElement) {
		let directDescendant = el === dropdownEl || dropdownEl.contains(el);

		if (directDescendant) {
			return true;
		}

		// Resolve popover chain
		let popoverParent = el.closest('[data-popover-id]') as HTMLElement;
		while (popoverParent) {
			let popoverAnchor = document.querySelector(
				"[data-popover-anchor-id='" + popoverParent.dataset.popoverId + "']"
			);

			if (popoverAnchor === dropdownEl || dropdownEl.contains(popoverAnchor)) {
				return true;
			}

			if (popoverAnchor) {
				popoverParent = popoverAnchor.closest('[data-popover-id]');
			} else {
				popoverParent = null;
			}
		}

		return false;
	}

	function handleDocumentClick(e: MouseEvent) {
		if (hideOnExternalClick && clickOpen) {
			if (dropdownEl && parentEl) {
				if (
					e.target !== dropdownEl &&
					!dropdownEl.contains(e.target as Node) &&
					e.target !== parentEl &&
					!parentEl.contains(e.target as Node) &&
					!isElementInPopover(e.target as HTMLElement)
				) {
					clickOpen = false;
					dispatch('close');
				}
			}
		}
	}

	if (typeof window !== 'undefined') {
		mutationObserver = new MutationObserver((mutationList, observer) => {
			for (const mutation of mutationList) {
				// Ignore our svg element dropdownPointerEl
				if (
					dropdownPointerEl &&
					(mutation.target === dropdownPointerEl || dropdownPointerEl.contains(mutation.target))
				) {
					continue;
				}

				if (mutation.type === 'childList') {
					calcPosition();
				} else if (mutation.type === 'attributes') {
					calcPosition();
				}
			}
		});

		resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				calcPosition();
			}
		});

		let killFrameLoop = false;

		onMount(() => {
			if (!(window as any).popover_elements) {
				(window as any).popover_elements = new Map();
			}

			(window as any).popover_elements.set(uid, {
				parentEl,
				dropdownEl
			});

			function frameLoop() {
				if (killFrameLoop) {
					return;
				}
				requestAnimationFrame(frameLoop);
				calcPosition();
			}

			if (watchAnimations) {
				frameLoop();
			}

			parentEl = childSlotEl.parentElement;

			if (parentEl) {
				parentEl.addEventListener('mouseenter', handleParentMouseEnter);
				parentEl.addEventListener('mouseleave', handleParentMouseLeave);
				parentEl.addEventListener('click', handleParentMouseClick);
			}

			document.addEventListener('click', handleDocumentClick);

			window.addEventListener('scroll', () => calcPosition());
			window.addEventListener('resize', () => calcPosition());

			observeInterests();

			calcPosition(true);
		});

		onDestroy(() => {
			if (parentEl) {
				parentEl.removeEventListener('mouseenter', handleParentMouseEnter);
				parentEl.removeEventListener('mouseleave', handleParentMouseLeave);
				parentEl.removeEventListener('click', handleParentMouseClick);
			}

			document.removeEventListener('click', handleDocumentClick);

			killFrameLoop = true;
			window.removeEventListener('resize', () => calcPosition());
			window.removeEventListener('scroll', () => calcPosition());
			mutationObserver.disconnect();
			resizeObserver.disconnect();
		});
	}
</script>

<span bind:this={childSlotEl} data-popover-anchor-id={uid}>
	{#if openReal}
		<div
			transition:transitionFn
			use:portal
			class={'popover ' + (useFixedPositioning ? 'popover-fixed ' : '') + ($$props.class || '')}
			bind:this={dropdownEl}
			data-popover-id={uid}
		>
			<svg
				width="0"
				height="0"
				viewBox="0 0 0 0"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class={'popover-caret popover-caret--' + dropdownPointerClass}
				bind:this={dropdownPointerEl}
			>
				<defs>
					<mask id="popover_hole_{uid}">
						<rect
							bind:this={dropdownPointerRectMaskFullEl}
							width="100%"
							height="100%"
							fill="white"
						/>
						<rect bind:this={dropdownPointerRectMaskEl} fill="black" />
					</mask>
				</defs>
				<clipPath id="popover_clip_{uid}">
					<path fill="red" d="M 0,0" bind:this={dropdownPointerRectPathEl} />
				</clipPath>
				<path bind:this={dropdownPointerPathEl} d="M0 0L0 0Z" id="popover_path_{uid}" />
				<use clip-path="url(#popover_clip_{uid})" href="#popover_path_{uid}" fill={caretBg} />
				<rect width="1px" height="1px" bind:this={dropdownPointerRectEl} />
			</svg>
			<slot />
		</div>
	{/if}
</span>

<style>
	:root {
		--popover-bg: white;
	}

	.popover {
		position: absolute;
		display: inline-block;
		z-index: var(--popover-z-index, 1060);
	}

	.popover.popover-fixed {
		position: fixed;
	}

	.popover-caret {
		position: absolute;
		pointer-events: none;
		overflow: visible;
	}
</style>
