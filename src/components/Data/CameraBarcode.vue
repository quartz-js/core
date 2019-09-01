<template>
  <q-card class="content">
    <div>
      <video id="video" style="border: 1px solid gray"></video>
    </div>
    <pre class='mt-5'>{{ textContent }}</pre>
  </q-card>
</template>

<script>
const ZXing = require('@zxing/library')

export default {
  data() {
    return {
      textContent: null,
      codeReader: null
    }
  },
  methods: {
    decodeContinuously(codeReader, selectedDeviceId) {
      codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
        if (result) {
          this.textContent = result
        }
        if (err) {
          if (err instanceof ZXing.NotFoundException) {
            console.log('No code found.')
          }
          if (err instanceof ZXing.ChecksumException) {
            console.log('A code was found, but it\'s read value was not valid.')
          }
          if (err instanceof ZXing.FormatException) {
            console.log('A code was found, but it was in a invalid format.')
          }
        }
      })
    }
  },
  mounted () {
    let selectedDeviceId;
    this.codeReader = new ZXing.BrowserMultiFormatReader();

    // const codeReader = new ZXing.BrowserQRCodeReader()

    this.codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        selectedDeviceId = videoInputDevices[0].deviceId
        
        this.decodeContinuously(this.codeReader, selectedDeviceId);

      })
      .catch((err) => {
        console.error(err)
      })
  },
  beforeDestroy() {
    this.codeReader.reset()
  }
}
</script>