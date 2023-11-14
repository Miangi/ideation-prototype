<script>
	import { onMount, onDestroy } from 'svelte'

	let canvas
	let ctx

	let rows = 16
	let rowOffset = 21
	let tileW = 90
	let tileH = 14
	let shiftSpeed = 0
	let padding = (rows + 10) * rowOffset

	function getPoint(ix, iy, t, offsetY){
		let shiftX = t / 50 * shiftSpeed
		let ixs = ix - Math.floor(shiftX / tileW)
		let waveScale = Math.pow(1600 / canvas.width, 0.3)
		let waveY = Math.sin((t + (ixs + iy * 0.75) * 400 * waveScale) / 1800) * 50
			+ Math.cos((t + (iy) * 800 * waveScale) / 1800) * 25

		return [
			ix * tileW + iy * rowOffset - padding + shiftX % tileW,
			iy * tileH + offsetY + waveY
		]
	}

	function tick(){
		render()
		requestAnimationFrame(tick)
	}

	function render(){
		let cols = Math.ceil((canvas.width + padding) / tileW)
		let t = performance.now()
		let offsetY = (canvas.height - (rows * tileH)) / 2

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		for(let ix=cols-1; ix>=0; ix--){
			for(let iy=0; iy<rows; iy++){
				ctx.fillStyle = '#1D1D1D'
				ctx.strokeStyle = '#FEFEFE'
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(...getPoint(ix, iy, t, offsetY))
				ctx.lineTo(...getPoint(ix+1, iy, t, offsetY))
				ctx.lineTo(...getPoint(ix+1, iy+1, t, offsetY))
				ctx.lineTo(...getPoint(ix, iy+1, t, offsetY))
				ctx.closePath()
				ctx.fill()
				ctx.stroke()
			}
		}
	}

	function updateSize(){
		canvas.width = canvas.parentNode.clientWidth
		canvas.height = canvas.parentNode.clientHeight
	}

	onMount(() => {
		ctx = canvas.getContext('2d')
		window.addEventListener('resize', updateSize)
		updateSize()
		tick()
		setTimeout(updateSize, 100)
	})

	onDestroy(() => {
		cancelAnimationFrame(tick)
		window.removeEventListener('resize', updateSize)
	})
</script>

<canvas bind:this={canvas}/>