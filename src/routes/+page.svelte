<script lang="ts">
	import { Popover, type Alignment } from '$lib';
	let t: Alignment = 'left';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<span>
	Hover me
	<Popover showOnHover>
		<div>Popover content</div>
	</Popover>
</span>
