<template>
  <div id="quagga">
    
  </div>
</template>

<script>
import Quagga from 'quagga';

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      readerSize: {
        width: 640,
        height: 480
      },
      detecteds: []
    }
  },
    mounted (data) {

      Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: document.querySelector('#quagga')    // Or '#yourElement' (optional)
        },
        decoder : {
          readers : ["code_128_reader"]
        }
      }, function(err) {
          if (err) {
              console.log(err);
              return
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
      });
    }
}
</script>