<template>
    <div class="course-edit">
        <course-or-update :is-edit='true' :courseId='courseId'></course-or-update>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CourseOrUpdate from '@/views/course/components/CreateOrUpdate.vue'
export default Vue.extend({
  name: 'course-edit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CourseOrUpdate
  }
})
</script>
<style lang="scss" scoped>

</style>
