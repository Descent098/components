<script>
    import { onMount } from "svelte";
    import QRCode from "qrcode";

    let { 
        title="QR Preview",
        link="https://", 
        qrColor = "#141414",
        qrColorVariable="",
        backgroundColor = "#f0f0f0",
        backgroundColorVariable="",
        scale="8",
        error="M",
        version=undefined,    // 0-40
        maskPattern=undefined // 0-7
    } = $props();

    let dataElement;
    let observer;
    let automaticallyDefineVersion = $state(true)
    let automaticallyDefineMask = $state(true)
    let versionIncompatible = $state(false)
    let minimumVersion = $state(0)


    function getCurrentQRColor() {
        if (qrColorVariable) {
            return getCSSVarValue(qrColorVariable)
        }
        return qrColor ?? "#141414";
    }

    function getCurrentBackgroundColor() {
        if (backgroundColorVariable) {
            return getCSSVarValue(backgroundColorVariable)
        }
        return backgroundColor ?? "#f0f0f0";
    }

    function getCSSVarValue(name) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
    }


    onMount(()=>{
        // If using variable, observe CSS changes
        if (qrColorVariable || backgroundColorVariable) {
            observer = new MutationObserver(() => {
                qrColor = getCurrentQRColor()
                backgroundColor = getCurrentBackgroundColor()
            });
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["style", "class", "data-theme"]
            });
            qrColor = getCurrentQRColor()
            backgroundColor = getCurrentBackgroundColor()
        }
        if (version !== undefined){
            automaticallyDefineVersion = false
        }
        if (maskPattern !== undefined){
            automaticallyDefineMask = false
        }
    })

    function setDefineVersion(){
        if (automaticallyDefineVersion){
            version=undefined
            versionIncompatible=false
            minimumVersion=0
        } else{
            version=0
            minimumVersion=0
        }
    }

    function setDefineMask(){
        if (automaticallyDefineMask){
            maskPattern=undefined
        } else{
            maskPattern=0
        }
    }


    $effect(() => {

            QRCode.toCanvas(dataElement, link, {
                errorCorrectionLevel:error,
                scale:parseFloat(scale),
                color: {
                    dark: qrColor,
                    light: backgroundColor,
                },
                maskPattern:parseInt(maskPattern),
                version:version
            }).then(()=>{
                versionIncompatible=false

            }).catch((err)=>{
                
                if (err.message.includes("The chosen QR Code version cannot contain this amount of data")){
                    versionIncompatible = true
                    minimumVersion = parseInt(err.message.slice(err.message.length-3, err.message.length-2))
                    version = minimumVersion
                } else{
                    console.log("Ecountered error while rendering", err.name, err.message)
                }

            })
        }
    )
</script>

{#if title}
<h3>{title}</h3>
{/if}
<canvas bind:this={dataElement}></canvas>

<form>
    <fieldset>
        <label for="link">Link: <input type="url" name="link" bind:value={link}></label>
        {#if !qrColorVariable}
        <label for="qrColor">QR Color: <input type="color" name="qrColor" bind:value={qrColor}></label>
        {/if}
        {#if !backgroundColorVariable}
        <label for="backgroundColor">Background Color: <input type="color" name="backgroundColor" bind:value={backgroundColor}></label>
        {/if}
        <label for="scale">Scale: <input type="number" name="scale" bind:value={scale}></label>
    </fieldset>
    <details><summary>Advanced Settings</summary>
        <fieldset>
            <label for="error">Error Correction: 
                <select name="error" bind:value={error}>
                    <option value="L">Low</option>
                    <option value="M">Medium</option>
                    <option value="H">High</option>
                    <option value="Q">Quartile</option>
                </select>
            </label>
            <label for="defineVersion">Automatically Select Version: <input type="checkbox" name="defineVersion" bind:checked={automaticallyDefineVersion} onchange={setDefineVersion}></label>
            {#if !automaticallyDefineVersion}
                <label for="version">QR Code Version: <input type="number" name="version" bind:value={version} max="40" min={minimumVersion}></label>
            {/if }

            <label for="defineMask">Automatically Select Mask: <input type="checkbox" name="defineMask" bind:checked={automaticallyDefineMask} onchange={setDefineMask}></label>
            {#if !automaticallyDefineMask}
                <label for="mask">QR Code Mask: <input type="number" name="version" bind:value={maskPattern} max="7" min="0"></label>
            {/if }
        </fieldset>
    </details>
</form>



<style>
    fieldset{
        display: flex;
        flex-direction: column;
    }
    canvas {
        width:100%;
    }
</style>
