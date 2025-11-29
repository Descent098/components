<script>
    import { onMount } from "svelte";
    import * as Plot from '@observablehq/plot';

    let initialized = $state(false)
    let plotEl = $state(undefined);
    let plot = $state(undefined)

    const {
        data,
        xAxisDataField,           // The field to use for the data for the x axis
        yAxisDataField,           // The field to use for the data for the y axis
        
        // Optional Fields
        title="",                 // The title of the chart
        subtitle="",              // The subtitle of the chart
        xAxisLabel=undefined,     // The label for the x axis
        yAxisLabel=undefined,     // The label for the y axis
        fillDataField=undefined,  // The field to colour the bars based on (usually y value or some sort of category)
        colorConfig=undefined,    // The color configuration (PlotOptions.color) SEE https://observablehq.com/@observablehq/plot-cheatsheets-colors
        domain=undefined,         // The domain (the range of numbers found in the y-axis)
        styleOverrides=undefined, // A PlotOptions.style object with any styling overrides for the chart
        width=undefined,          // The width of the chart
        height=undefined,         // The height of the chart
        tooltips=true,            // Whether to display Tooltips or not when hovering over bars
        sort=true,                // Whether to sort the values displayed by y vaule
        sortDescending=true,      // If sort is true, false will sort by ascending, true will be sort by descending values
        valuesOnBars=true,        // Whether to show the y-value of the bar over top of the bar
    } = $props();

    onMount(async ()=>{
        
        plot = Plot.plot({
        width:width,
        height:height,
        marginTop:30,      
        x:{label:xAxisLabel},
        y:{label:yAxisLabel},
        marks: [
            Plot.barY(data, {x: xAxisDataField, y: yAxisDataField, sort: sort? {x: "y", reverse: sortDescending}:undefined, fill:fillDataField, tip:tooltips}),
            domain ? Plot.ruleY(domain):Plot.ruleY([0]),
            Plot.axisX({marginBottom:40}),
            valuesOnBars?Plot.text(data, {x: xAxisDataField, y: yAxisDataField, text: (d) => (d[yAxisDataField]), dy: -6, lineAnchor: "bottom"}):undefined,
        ],
        color:colorConfig,
        style: styleOverrides,
        })
        initialized = true
        updateComponent()
  })

    function updateComponent() {
        if (!initialized || plot === undefined) return
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
        if (plot) {
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



