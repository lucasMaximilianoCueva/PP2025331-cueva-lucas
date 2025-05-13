const series = [];
let currentPage = 1;
const maxSeries = 6;
document.addEventListener("DOMContentLoaded", () => {
  fetchSeries();
});

const fetchSeries = async () => {
  const seriesContainer = document.getElementById("series");
  series.length = 0;

  let startId = currentPage;
  let validSeriesCount = 0;

  while (validSeriesCount < maxSeries) {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${startId}`);
      
      if (response.ok) {
        const data = await response.json();
        const serie = Serie.createFromJsonString(data);
        series.push(serie);
        validSeriesCount++;
      }
    } catch (error) {
      console.error(`Error fetching serie ${startId}:`, error);
    }
    startId++;
  }

  currentPage = startId - maxSeries;

  series.sort((a, b) => a.id - b.id);

  series.forEach((serie) => {
    const element = serie.createHtmlElement(serie);
    seriesContainer.appendChild(element);
  });
};

const nextPage = () => {
  series.forEach((serie) => {
    serie.deleteHtmlElement(serie);
  });
  currentPage += maxSeries;
  fetchSeries();
};

const previousPage = () => {
  if (currentPage <= 1) {
    return;
  }
  series.forEach((serie) => {
    serie.deleteHtmlElement(serie);
  });
  currentPage = Math.max(1, currentPage - maxSeries);
  fetchSeries();
};