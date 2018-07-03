<template>

    <div>
        <codemirror
            :value="rawValue" 
            @input="onInput($event)" 
            :options="options"
            @cursorActivity="onCursorActivity"
            @blur = "fix"
        ></codemirror> 
    </div>
</template>

<script>


import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'

export default {

    props: ["json", "value"],
    components: {
        codemirror
    },
    data() {
        return {
            rawValue: "",
            doc: null,
            options: {
                tabSize: 2,
                mode: 'text/html',
                theme: 'material',
                showInvisibles: true,
                lineNumbers: true,
                lineWrapping: true,
                line: true,
                autoCloseBrackets: true,
            },
        }
    },

    methods: {


        fix()
        {
            this.rawValue = this.rawValue;
        },

        beautify(text)
        {
            return text;
        },

        onCursorActivity($event)
        {
            this.doc = $event.doc;
        },

        onInput($event)
        {
            this.$emit("input", $event);
            // $event = this.beautify($event);

            var pos_original = this.doc.getCursor();


            // 
        }
    },
    created() {
        this.rawValue = this.beautify(this.value);
    }
}

</script>
<style>
    .editor .CodeMirror {
        height: 700px;
    }

    .editor iframe {
        height: 700px;
    }

    .editor iframe {      
        overflow-y: scroll;
        min-height: 0;
    }

    .editor {
        height: 700px;
    }
    .editor > * {
        height:auto !important;

    }
</style>