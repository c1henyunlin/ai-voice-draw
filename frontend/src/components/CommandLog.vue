<template>
  <div class="command-log" v-if="commands.length > 0">
    <h3>📝 指令记录</h3>
    <ul>
      <li v-for="(cmd, i) in commands" :key="i">
        {{ JSON.stringify(cmd) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ commands: { type: Array, default: () => [] } })
</script>

<style scoped>
.command-log {
  margin: 15px auto;
  max-width: 600px;
  text-align: left;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
}
.command-log ul {
  list-style: none;
  max-height: 150px;
  overflow-y: auto;
}
.command-log li {
  font-size: 12px;
  padding: 3px 0;
  border-bottom: 1px solid #eee;
}
</style>
