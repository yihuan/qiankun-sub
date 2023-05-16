<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const name = ref('Sky')

    return () => <div>Hello, {name.value}</div>
  }
})
</script>
