<template>
  <VChart :option="option" autoresize style="width: 100%; height: 300px" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useAsyncData } from '#app'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

const { data: chartData } = await useAsyncData('clientsByMonth', () =>
  $fetch('/api/clientsByMonth')
)

const option = ref({
  title: { text: 'Increase Clients by Month' },
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 40, bottom: 40 },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Clients',
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#2C2F3A' }
    }
  ]
})

watchEffect(() => {
  if (chartData.value) {
    option.value.xAxis.data = chartData.value.map((item) => item.month)
    option.value.series[0].data = chartData.value.map((item) => item.count)
  }
})
</script>
