<template>
  <router-view></router-view>
  <Reminder />
</template>


<script>

import Reminder from './components/utils/reminder.vue';

export default{
  components: {
    Reminder
  }
}
</script>

<style>

</style>