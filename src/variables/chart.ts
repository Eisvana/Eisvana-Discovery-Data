export const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
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
