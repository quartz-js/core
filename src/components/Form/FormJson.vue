<template>

    <div>
        <codemirror
            :value="rawValue" 
            @input="onInput($event)" 
            :options="options"
            @cursorActivity="onCursorActivity"
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

    props: ["json", "options", "value"],
    components: {
        codemirror
    },
    data() {
        return {
            rawValue: "",
            doc: null,
        }
    },

    methods: {

        isJson(test)
        {
            try {
                JSON.parse(test);
                return true;
            } catch (e) {
                return false;
            }
        },

        beautify(text)
        {
            var beautify_js = require('js-beautify').js_beautify; 

            return text ? beautify_js(text, { indent_size: 4 }) : '';
        },

        onCursorActivity($event)
        {
            this.doc = $event.doc;
        },

        onInput($event)
        {
            if (this.isJson($event)) {

                this.$emit("input", JSON.parse($event));
                $event = this.beautify($event);

                var pos_original = this.doc.getCursor();

                // this.rawValue = $event;
                // var pos_new = this.doc.getCursor();
                // console.log(pos_original.line, pos_original.ch);
                // this.doc.setCursor(pos_original.line, pos_original.ch);
            }

            // 
        }
    },
    created() {

        this.rawValue = JSON.stringify(this.value);
        this.rawValue = this.beautify(this.rawValue);
    }
}

</script>