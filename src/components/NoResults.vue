<template>
  <div>
    <div class="ct">
      <h4>{{ $t('$quartz.no-results.title') }}</h4>
      <p>{{ $t('$quartz.no-results.message') }}</p>
      <img src="https://cdn.dribbble.com/users/37530/screenshots/2485318/no-results.png">
    </div>
  </div>
</template>
<style scoped>
.ct {
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
  margin: 50px 0;
}

.ct img{
  max-height: 300px;
}

h4 {
  margin-top: 20px;

}
</style>
