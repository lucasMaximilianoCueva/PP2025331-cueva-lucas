// on load page
document.addEventListener("DOMContentLoaded", () => {
  const seriesContainer = document.getElementById('series');
  const series = [];

  const fetchPromises = [];
  for (let i = 1; i < 7; i++) {
    fetchPromises.push(
      fetch(`https://api.tvmaze.com/shows/${i}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching series ${i}`);
          }
          return response.json();
        })
        .then(data => {
          const serie = Serie.createFromJsonString(data);
          series.push(serie);
          return serie;
        })
        .catch(error => {
          console.error(`Error processing series ${i}:`, error);
        })
    );
  }

  Promise.all(fetchPromises)
    .then(() => {
      series.sort((a, b) => a.id - b.id);
      
      series.forEach(serie => {
        const element = serie.createHtmlElement(serie);
        seriesContainer.appendChild(element);
      });
    })
    .catch(error => {
      console.error('Error loading series:', error);
    });
});
