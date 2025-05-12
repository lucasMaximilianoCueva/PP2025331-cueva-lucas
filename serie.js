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
    serieElement.innerHTML = `
      <img src="${serie.image.medium}" alt="${serie.name}">
      <h2>${serie.name}</h2>
      <p>${serie.language}</p>
      <p>${serie.genres}</p>
    `;
    return serieElement;
  }
}

