<p align="center">
	<img src="docs/svelte-popover.svg">
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/AskingQuestions/svelte-smooth-popover" alt="Version">
  <img src="https://img.shields.io/github/license/AskingQuestions/svelte-smooth-popover" alt="License">
</p>

<h1 align="center" ><a  href="https://svelte-smooth-popover.jrmy.dev/">svelte-smooth-popover</a></h1>

A robust, unstyled popover component for Svelte with a customizable smooth/sharp caret.

<p align="center">
<img src="https://i.imgur.com/jxpdbmG.png">
</p>

## Docs/playground

https://svelte-smooth-popover.jrmy.dev

## Installation

```bash
npm i svelte-smooth-popover
```

## Usage

```html
<script>
	import { Popover } from 'svelte-smooth-popover';
</script>

<button>
	Example
	<Popover>
		<div class="shadow-sm bg-white">Popover content</div>
	</Popover>
</button>
```
