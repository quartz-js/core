<template>
  <div v-if="show && rawValue">
    <v-text-field 
      :value="rawValue.filename" prepend-icon='attach_file'
      :label="label !== undefined ? label : getAttributeLabel(attribute)"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute) "
      persistent-hint
      readonly
      @click='pickFile'
    ></v-text-field>

    <input type="file" ref="image" style="display: none" @change="previewImage($event)">
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
    <v-layout v-if="rawValue.filename">
      <div>
        <div v-if="fileType == 'image'">
          <canvas id="uploader" ref="uploader" class="preview">
            Your browser does not support the HTML5 canvas element.
          </canvas>
        </div>
        <div v-else>
          Nope
        </div>
      </div>
      <div class="pa-4" v-if="fileType == 'image'">
        <div class='fluid fluid-vcenter' v-if='crop'>
          <v-btn color="primary" v-bind:class="{disabled: !rawValue.content}" @click="destroyCropImage()">{{ $t('Back')}}</v-btn>
          <v-btn color="primary" v-bind:class="{disabled: !rawValue.content}" @click="resetCropImage()">{{ $t('Reset')}}</v-btn>
          <v-btn color="primary" v-bind:class="{disabled: !rawValue.content}" @click="saveCropImage()">{{ $t('Save crop')}}</v-btn>
        </div>

        <div v-if="!crop">
          <v-btn color="primary" @click="cropImage()">{{ $t('Crop')}}</v-btn>
        </div>
        <br>
        <v-layout v-if='crop'>
          <v-text-field :label="$t('ratio_width')" v-model="width" required v-on:change="resetCropImage()" />
          <v-text-field :label="$t('ratio_height')" v-model="height" required v-on:change="resetCropImage()" />
        </v-layout>
      </div>
    </v-layout>

  </div>
</template>
<script>

import Cropper from 'cropperjs';
require('cropperjs/dist/cropper.min.css');
import { BaseAttribute } from '../../attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

export default {
  mixins: [
    AttributePreMount,
    ResourceLocalization
  ],
  props: {
    placeholder: {

    },
    label: {
      default: undefined
    },
    hint: {
      default: undefined
    },
    value: {
      required: true,
    },
    attribute: {
      type: BaseAttribute,
      required: true
    },
    errors: {
      required: true
    }
  },
  data() {
    return {
      fileName: null,
      progress: 0,
      crop : null,
      fileType: null,
      height: 1,
      width: 1,
      file: null,
    	rawValue: {
        content: null,
        filename: null,
        filetype: null
      },
    }
  },
  mounted () {

    if (!this.canMount()) {
      return;
    }
    
    this.reloadRawValue();
  },
  watch: {
  	value: function (){
    	this.reloadRawValue();
  	}
  },
  methods: {
    pickFile () {
      this.$refs.image.click ()
    },
  	reloadRawValue() {
    	this.rawValue = this.attribute.extractValue(this.value);
  	},
    onChange () {
      this.attribute.injectValue(this.value, this.rawValue);

      this.$emit('input', this.value);
    },
    cropImage() {

      var canvas = this.$refs.uploader;
      var context = canvas.getContext("2d");

      this.crop = new Cropper(canvas, {
        aspectRatio: this.width / this.height,

        autoCropArea: 1,
        zoomable: false,
        viewMode:1,
        crop: (e) => { },
        built: () => { }
      });
      var canvas = this.$refs.uploader;
      var context = canvas.getContext("2d");
    },
    saveCropImage() {
      this.crop.getCroppedCanvas().toBlob((blob) => {
        this.loadImage(blob)
      });
    },
    loadImage (blob) {


      this.rawValue.file = new File([blob], this.rawValue.filename);

      this.fileType = this.file.type.includes('image/') ? 'image' : 'other'

      if (this.fileType === 'image') {
        var reader1 = new window.FileReader();

        reader1.readAsDataURL(blob); 
        reader1.onloadend = () => {
          this.createPreview(reader1.result);
        }
      }
      
      var reader2 = new window.FileReader();
      reader2.readAsText(blob); 
      reader2.onloadend = () => {
        this.rawValue.content = reader2.result;
        this.onChange();
      }
    },
    destroyCropImage() {
      if (this.crop) {
          this.crop.destroy();
      }

      this.crop = null;
    },
    resetCropImage() {
      this.destroyCropImage();
      this.cropImage();
    },

    createPreview: function(content) {

      var canvas = this.$refs.uploader;
      var context = canvas.getContext("2d");
      this.destroyCropImage();

      var img = new Image();
      img.onload = function() {
        context.canvas.height = img.height;
        context.canvas.width  = img.width;
        context.drawImage(img, 0, 0);
      }

      img.src = content;
    },
        
    previewImage: function(event) {
      var input = event.target;

      if (input.files && input.files[0]) {

        var file = input.files[0];
        var reader = new FileReader();

        var filename = file.name.split('.');

        this.rawValue.filename = file.name;
        this.rawValue.filetype = filename[1];
        this.file = file
        this.loadImage(file)
      }
    }
  }
}

</script>
<style scoped>
  .v-messages__message {
    line-height: inherit !important;
  }
  .preview {
      padding: 2px;
      border:1px solid #efefef;
      max-width: 500px;
      max-height: 300px;
      margin-top: 10px;
  }

  img {
    max-width: 100%;
  }
</style>
