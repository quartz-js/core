<template>
<div>
  {{ message }}
</div>
</template>
<script>
export default {
  mounted(){
    alert('Mounted!')     
  },
  data () {
    return {
       message: "Mounted"
    }
  },
}
</script>>