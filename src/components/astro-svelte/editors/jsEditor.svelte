<script lang="ts">
import { javascript } from "@codemirror/lang-javascript";
import SimpleEditor from "@/components/astro-svelte/editors/simpleCodeEditor.ts.svelte"
</script>

<SimpleEditor
  fileTitle="📄myfile.js"
  initialData={`function helloWorld(){
  console.log("Hello World!")
}`}
  language={javascript}
/>