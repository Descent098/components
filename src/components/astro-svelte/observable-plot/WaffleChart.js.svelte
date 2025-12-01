<script>
    import { onMount } from "svelte";
    import * as Plot from '@observablehq/plot';

    let initialized = $state(false)
    let plotEl=$state(undefined);
    let plot = $state("<div></div>")

    const {
        data,                          // The data for the chart
        xAxisDataField,                // The field to use for the data for the x axis
        yAxisDataField,                // The field to use for the data for the y axis
        totalField,                    // The field that is considered to be the total to compare the y axis to
        
        // Optional Fields
        title="",                      // The title of the chart
        subtitle="",                   // The subtitle of the chart
        zAxisDataField=undefined,      // The z-axis field (multi-quanitity facet value)
        colorConfig=undefined,         // The color configuration (PlotOptions.color) SEE https://observablehq.com/@observablehq/plot-cheatsheets-colors
        fillColor=undefined,           // The color of the fill
        percentageTextColor=undefined, // The color of the text with the percentage (use CurrentColor to make it default text color)
        questionTextColor=undefined,   // The color of the question text (use CurrentColor to make it default text color)
        styleOverrides=undefined,      // A PlotOptions.style object with any styling overrides for the chart
        width=undefined,               // The width of the chart
        height=undefined,              // The height of the chart
        columnWidth=undefined,         // The number of buckets/row
        circles=true,                  // If true will render as circles instead of squares
        columnGap=undefined,           // The gap between each mark
        totalOpacity=0.4,              // The opacity of the unfilled/total squares (that show total-yAxisDataField)
        totalFill=undefined            // The fill for the unfilled/total squares (that show total-yAxisDataField)
    } = $props();

    onMount(async ()=>{
        plot = Plot.plot({
        width:width,
        height:height,
        marginTop:30,      
        insetLeft:20,
        insetRight:10,
        marginBottom: 70,
        axis: null,
        label: null,
        marks: [
            Plot.waffleY(data, {fx: xAxisDataField,y: totalField, fillOpacity:totalOpacity,fill:totalFill, rx: circles?"100%":undefined, multiple:columnWidth, gap:columnGap, sort:{fx:"y"}}),
            
            zAxisDataField?
                Plot.waffleY(data, 
                Plot.groupZ({y: "sum",},{fx: xAxisDataField,  fill: zAxisDataField, sort:zAxisDataField, y:yAxisDataField, rx: circles?"100%":undefined, multiple:columnWidth, gap:columnGap})
                )
                :
                Plot.waffleY(data, {fx: xAxisDataField, y: yAxisDataField, rx: circles?"100%":undefined, fill: fillColor?fillColor:"orange", multiple:columnWidth, gap:columnGap}),
            Plot.axisFx({lineWidth: 20, anchor: "bottom", dy: 20, fill:questionTextColor}),
            Plot.text(data, {fx: xAxisDataField, text: (d)=>(d[yAxisDataField]/d[totalField]).toLocaleString("en-US", {style:"percent"}), frameAnchor: "bottom", lineAnchor: "top", dy: 6, fill: percentageTextColor?percentageTextColor:fillColor?fillColor:"orange", fontSize: 24, fontWeight: "bold"})
        ],
        style: styleOverrides,
        color: colorConfig? colorConfig: zAxisDataField?{legend:true}:undefined
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



