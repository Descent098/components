<script>
    import { onMount } from "svelte";
    import * as Plot from '@observablehq/plot';

    let initialized = $state(false)
    let plotEl =$state(undefined);
    let plot = $state("<div></div>")

    const {
        data,
        
        // Optional Fields
        title="",                 // The title of the chart
        subtitle="",              // The subtitle of the chart
        textStrokeColor="black",  // The color of the stroke of the text
        lineColor=undefined,      // The color of the line
        colorConfig=undefined,    // The color configuration (PlotOptions.color) SEE https://observablehq.com/@observablehq/plot-cheatsheets-colors
        styleOverrides=undefined, // A PlotOptions.style object with any styling overrides for the chart
        width=undefined,          // The width of the chart
        height=undefined,         // The height of the chart
        tooltips=true,            // Whether to display tooltips or not
        delimiter="/",            // The delimiter to define relationships in the heirarchy
        strokeWidth=1,
    } = $props();

    onMount(async ()=>{
        plot = Plot.plot({
            axis: null,
            width:width,
            height: height,
            margin: 10,
            marginLeft: 40,
            marginRight: 120,
            marks: [
                Plot.tree(data, {textStroke: textStrokeColor, tip:tooltips, fill:lineColor, strokeWidth:strokeWidth, delimiter:delimiter})
            ],
            style: styleOverrides,
            color: colorConfig
        })
        initialized = true
        updateComponent()
  })

    function updateComponent() {
        if (!initialized || plot === undefined) return

        //@ts-ignore
        if (plotEl === undefined|| plotEl===""){
            plotEl = document.createElement("div")
        }

        // Setup titles + subtitles
        const titleElement = document.createElement("h2");
        titleElement.classList.add("text-xl", "font-bold");
        titleElement.innerHTML = title;

        const subTitleElement = document.createElement("h4");
        subTitleElement.classList.add("text-md");
        subTitleElement.innerHTML = subtitle;
        plotEl.innerHTML = ""; // Reset element state

        // Build up element peice by peice
        if (title){
            plotEl.appendChild(titleElement);
        }
        if (subtitle){
            plotEl.appendChild(subTitleElement);
        }
        if (plot instanceof HTMLElement || plot instanceof SVGSVGElement) {
            plotEl.appendChild(plot);
        }
    }

    $effect(updateComponent);
</script>

<style>
    .plot{
        width:100%;
        display: flex;
        flex-direction: column;
        gap:1rem;
        min-height: fit-content;
    }
    .plot-placeholder{
        min-height:800px;
        min-width:800px;
        display: flex;
        justify-content: center;
        justify-items: center;
        align-items: center;
        font-size-adjust: 200%;
    }
</style>


{#if initialized}
  <div class="plot" bind:this={plotEl}></div>
{:else}
  <div class="plot-placeholder">
      <div>...loading</div>
  </div>
{/if}



