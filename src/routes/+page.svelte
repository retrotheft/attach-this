<script>
   import '../app.css'
	import { hoverable } from '$lib/index.js'

	console.log((hoverable))
</script>

<svelte:head>
   <title>Attach This!</title>
</svelte:head>

<section {...hoverable}>
	<article {...hoverable}>
		{$hoverable?.tagName}
	</article>
</section>

<div>
	<div {...hoverable}>
	</div>
</div>

<style>
	section, article, div {
		border: 2px dashed grey;
		padding: 50px;
		min-height: 10vh;

		&:global(.hovering) {
			border-color: hotpink;
			cursor: pointer;
		}
	}
</style>
