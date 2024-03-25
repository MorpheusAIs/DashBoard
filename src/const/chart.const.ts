import { type ChartConfig } from '@/types'

export const AMOUNT_OF_DEPOSIT_CHART_CONFIG: Readonly<ChartConfig> =
  Object.freeze({
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
            color: '#b1b1b1',
          },
          ticks: {
            color: '#ffffff',
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
            callback: (val: unknown) => String(val).replace(/000$/, 'K'),
            stepSize: 5000,
          },
          min: 0,
          max: 35000,
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
