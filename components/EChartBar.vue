<script setup>
import { ref } from 'vue'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer])

const option = ref({
  xAxis: {
    type: 'category',
    data: ['Sydney', 'Parramatta', 'Chatswood', 'Zetland']
  },
  yAxis: { type: 'value' },
  series: [
    {
      data: [7, 3, 2, 1],
      type: 'bar',
      itemStyle: { color: '#2C2F3A' }
    }
  ]
})
</script>

<template>
  <VChart :option="option" style="width:100%;height:300px;" />
</template>
