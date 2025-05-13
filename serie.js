class Serie {
  constructor(id, url, name, language, genres, image) {
    this.id = id;
    this.url = url;
    this.name = name;
    this.language = language;
    this.genres = genres;
    this.image = image;
  }

  toJsonString() {
    return JSON.stringify(this);
  }

  static createFromJsonString(jsonString) {
    return new Serie(jsonString.id, jsonString.url, jsonString.name, jsonString.language, jsonString.genres, jsonString.image);
  }

  createHtmlElement(serie) {
    const serieElement = document.createElement("div");
    serieElement.id = serie.id;
    serieElement.innerHTML = `
      <a href="${serie.url}" target="_blank">
        <img src="${serie.image.medium}" alt="${serie.name}">
      </a>
      <h2>${serie.name}</h2>
      <p>${serie.language}</p>
      <p>${serie.genres}</p>
      <button class="save-btn">Guardar</button>
    `;
    
    const guardarBtn = serieElement.querySelector('.save-btn');
    guardarBtn.addEventListener('click', () => {
      Serie.saveSerie(serie);
    });
    
    return serieElement;
  }

  deleteHtmlElement(serie) {
    const serieElement = document.getElementById(serie.id);
    serieElement.remove();
  }

  static saveSerie(serie) {
    let saveSeries = JSON.parse(localStorage.getItem('saveSeries')) || [];
    
    const serieExiste = saveSeries.some(s => s.id === serie.id);
    
    if (!serieExiste) {
      saveSeries.push(serie);
      // Guardar el array actualizado en localStorage
      localStorage.setItem('saveSeries', JSON.stringify(saveSeries));
      alert('Serie guardada exitosamente');
    } else {
      alert('Esta serie ya está guardada');
    }
  }

  static actualOrder = {
    criteria: null,
    asc: true
  };

  static orderBy(criteria) {
    const botones = document.querySelectorAll('.order-button');
    botones.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (Serie.actualOrder.criteria === criteria) {
      Serie.actualOrder.asc = !Serie.actualOrder.asc;
    } else {
      Serie.actualOrder.criteria = criteria;
      Serie.actualOrder.asc = true;
    }

    Serie.loadSavedSeries();
  }

  static loadSavedSeries() {
    const saveSeries = JSON.parse(localStorage.getItem('saveSeries')) || [];
    const container = document.getElementById('series-container');

    if (saveSeries.length === 0) {
      container.innerHTML = '<p>No series saved</p>';
      return;
    }

    if (Serie.actualOrder.criteria) {
      saveSeries.sort((a, b) => {
        let valueA, valueB;

        switch (Serie.actualOrder.criteria) {
          case 'name':
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
            break;
          case 'language':
            valueA = a.language.toLowerCase();
            valueB = b.language.toLowerCase();
            break;
          case 'genres':
            valueA = a.genres.join(',').toLowerCase();
            valueB = b.genres.join(',').toLowerCase();
            break;
        }

        if (valueA < valueB) return Serie.actualOrder.asc ? -1 : 1;
        if (valueA > valueB) return Serie.actualOrder.asc ? 1 : -1;
        return 0;
      });
    }

    container.innerHTML = '';
    saveSeries.forEach(serie => {
      const serieElement = document.createElement('div');
      serieElement.className = 'serie-card';
      serieElement.innerHTML = `
        <a href="${serie.url}" target="_blank">
          <img src="${serie.image.medium}" alt="${serie.name}">
        </a>
        <h2>${serie.name}</h2>
        <p>language: ${serie.language}</p>
        <p>genres: ${serie.genres.join(', ')}</p>
        <button class="delete-btn" onclick="Serie.deleteSerie(${serie.id})">Eliminar</button>
      `;
      container.appendChild(serieElement);
    });
  }

  static deleteSerie(id) {
    let saveSeries = JSON.parse(localStorage.getItem('saveSeries')) || [];
    saveSeries = saveSeries.filter(serie => serie.id !== id);
    localStorage.setItem('saveSeries', JSON.stringify(saveSeries));
    Serie.loadSavedSeries();
  }
}

