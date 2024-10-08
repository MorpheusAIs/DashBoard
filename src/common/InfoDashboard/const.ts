import { type ChartConfig } from '@/types'

export const CHART_CONFIG: Readonly<ChartConfig> = Object.freeze({
  type: 'line',
  options: {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        border: {
          dash: [2],
        },
        grid: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          color: (ctx: any) => {
            return ctx.index === 0 || (ctx.index + 1) % 5 === 0
              ? '#b1b1b1'
              : '#4f4f4f'
          },
        },
        ticks: {
          color: '#ffffff',
          autoSkip: false,
          maxRotation: 0,
          callback: function (value: unknown, idx: number) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const label = (this as any).getLabelForValue(value)
            return idx === 0 || (idx + 1) % 5 === 0 ? label : ''
          },
        },
      },
      y: {
        border: {
          dash: [2],
        },
        grid: {
          color: '#4f4f4f',
        },
        ticks: {
          color: '#ffffff',
          callback: (val: unknown) => {
            let fixedVal = Number(val).toFixed(3)
            fixedVal = parseFloat(fixedVal).toString()
            return fixedVal.replace(/000$/, 'K')
          },
          stepSize: 5000,
        },
      },
    },
  },
  data: {
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: '#ff7c03',
        pointBackgroundColor: '#ff7c03',
        pointRadius: 4,
        data: [],
      },
    ],
  },
})
