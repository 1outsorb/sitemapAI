<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer])

const option = ref({
  title: { text: 'Clients by Suburb' },
  tooltip: {},
  grid: { left: 40, right: 20, top: 40, bottom: 40 },
  xAxis: {
    type: 'category',
    data: ['Sydney', 'Parramatta', 'Chatswood', 'Zetland'],
    axisTick: { alignWithLabel: true }
  },
  yAxis: { type: 'value' },
  series: [
    {
      data: [7, 3, 2, 1],
      type: 'bar',
      itemStyle: { color: '#2C2F3A' },
      barWidth: '50%'
    }
  ]
})
</script>

<template>
  <VChart :option="option" autoresize style="width: 100%; height: 300px" />
</template>

