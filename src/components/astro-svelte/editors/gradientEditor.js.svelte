<script>
    let {
        color1 = "#3f5efb",
        color2 = "#fc466b",
        colorPercentage1 = 0,
        colorPercentage2 = 100,
        gradientType = "linear-gradient",
        angle = 166,
    } = $props();

    const originalSettings = {
        color1: "#3f5efb",
        color2: "#fc466b",
        colorPercentage1: 0,
        colorPercentage2: 100,
        gradientType: "linear-gradient",
        angle: 166,
    };

    let gradientString = $state("");
    let previewWidth = $state(null);
    let previewHeight = $state(null);

    $effect(() => {
        let angleString = `${angle}deg`;

        if (gradientType === "radial-gradient") {
            angleString = "circle";
        }

        gradientString = `${gradientType}(${angleString},${color1} ${colorPercentage1}%, ${color2} ${colorPercentage2}%)`;
    });

    function resetGradient() {
        color1 = originalSettings["color1"];
        color2 = originalSettings["color2"];
        colorPercentage1 = originalSettings["colorPercentage1"];
        colorPercentage2 = originalSettings["colorPercentage2"];
        gradientType = originalSettings["gradientType"];
        angle = originalSettings["angle"];
    }
</script>

<fieldset>
    <legend>Start Color settings</legend>
    <label class="input">
        <span class="label">Color</span>
        <input
            type="color"
            name="color1"
            id="defaultImageColor1"
            bind:value={color1}
        />
    </label>
    <label class="input">
        <span class="label">Start Percentage</span>
        <input
            class="range"
            type="range"
            name="colorPercentage1"
            id="defaultImageColorPercentage1"
            bind:value={colorPercentage1}
            min="0"
            max="100"
        />
    </label>
</fieldset>
<fieldset>
    <legend>End Color settings</legend>
    <label class="input">
        <span class="label">Color</span>
        <input
            type="color"
            name="color2"
            id="defaultImageColor2"
            bind:value={color2}
        />
    </label>
    <label class="input">
        <span class="label">End Percentage</span>
        <input
            class="range"
            type="range"
            name="colorPercentage2"
            id="defaultImageColorPercentage2"
            bind:value={colorPercentage2}
            min="0"
            max="100"
        />
    </label>
</fieldset>
{#if gradientType !== "radial-gradient"}
    <fieldset>
        <legend>Gradient Angle</legend>

        <input
            class="range"
            type="range"
            name="angle"
            id="defaultImageAngle"
            bind:value={angle}
            max="360"
            min="0"
        />
    </fieldset>
{/if}
<fieldset>
    <legend>Gradient type</legend>

    <select
        name="gradientType"
        id="defaultImageGradientType"
        class="select"
        bind:value={gradientType}
    >
        <option value="linear-gradient">Linear Gradient</option>
        <option value="radial-gradient">Radial Gradient</option>
    </select>
</fieldset>
<div>
    Preview
    <div
        bind:offsetWidth={previewWidth}
        bind:offsetHeight={previewHeight}
        style={`
                background: ${gradientString}; 
                min-width: 75px;
                min-height:75px;
                max-width:100%;
                border-radius:.25rem;
                resize: both;
                overflow: auto;
            `}
    ></div>
    {#if previewWidth && previewWidth}
        <div>
            Preview Size (width x height): {previewWidth} x {previewHeight}
        </div>
    {/if}
</div>
<pre><code>{gradientString}</code></pre>
<button onclick={resetGradient}>Reset to default</button>
<button
    onclick={() => {
        navigator.clipboard
            .writeText(gradientString)
            .then(() => {
                alert("Text copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
                alert("Failed to copy text, please try again or copy manually");
            });
    }}>Copy to Clipboard</button
>

<style>
    fieldset {
        display: flex;
        flex-direction: column;
        padding: 0;
    }
</style>
