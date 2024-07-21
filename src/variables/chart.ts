const isPortrait = window.matchMedia('(orientation: portrait)');

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: isPortrait ? 1 : undefined,
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
