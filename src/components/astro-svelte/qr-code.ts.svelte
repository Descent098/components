<script lang="ts">
    import { onMount } from "svelte";
    import QRCode, { type QRCodeMaskPattern, type QRCodeErrorCorrectionLevel } from "qrcode";

    let { 
        link, 
        qrColor = "#141414",
        qrColorVariable="",
        backgroundColor = "#f0f0f0",
        backgroundColorVariable="",
        scale="4",
        /**@type {QRCodeErrorCorrectionLevel}*/
        error="M",
        version=undefined,    // 0-40
        maskPattern=undefined // 0-7
    } = $props();

    let dataElement: HTMLCanvasElement;
    let observer: MutationObserver;

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

    function getCSSVarValue(name: string) {
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
    })

    $effect(() => {

            QRCode.toCanvas(dataElement, link, {
                errorCorrectionLevel:error as QRCodeErrorCorrectionLevel,
                scale:parseFloat(scale),
                color: {
                    dark: qrColor,
                    light: backgroundColor,
                },
                maskPattern:parseInt(maskPattern) as QRCodeMaskPattern,
                version:version
            });
        }
    )
</script>

<canvas bind:this={dataElement}></canvas>

<style>
    canvas {
        width:100%;
    }
</style>
