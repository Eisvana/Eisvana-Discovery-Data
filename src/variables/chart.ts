export const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1,
};

export const barChartOptions = {
  ...chartOptions,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
