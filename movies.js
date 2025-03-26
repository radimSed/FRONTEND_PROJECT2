"use strict";
// data definition
class ModalDialog {
    modalDialog;
    modalGenre;
    modalSummary;
    modalButton;
    constructor(modalDialog, //reference to the modal dialog
    modalGenre, //where the genres will be listed in the modal dialog
    modalSummary, //where the summary will be shown in the modal dialog
    modalButton) {
        this.modalDialog = modalDialog;
        this.modalGenre = modalGenre;
        this.modalSummary = modalSummary;
        this.modalButton = modalButton;
        this.modalButton.addEventListener('click', () => {
            modalDialog.style.display = 'none';
        });
    }
    getModalDialog() {
        return this.modalDialog;
    }
    getModalGenre() {
        return this.modalGenre;
    }
    getModalSummary() {
        return this.modalSummary;
    }
    setDisplayProperty(value) {
        this.modalDialog.style.display = value;
    }
}
class MovieInfo {
    name;
    genre;
    image;
    summary;
    resultDiv;
    modalDialog;
    constructor(name, genre, image, summary, resultDiv, //where the list will be put
    modalDialog) {
        this.name = name;
        this.genre = genre;
        this.image = image;
        if (summary === null) {
            this.summary = 'Summary not found';
        }
        else {
            this.summary = summary;
        }
        this.resultDiv = resultDiv;
        this.modalDialog = modalDialog;
    }
    addToWebPage() {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-div');
        const movieImg = document.createElement('img');
        if (this.image !== '') {
            movieImg.src = this.image;
        }
        const movieGenres = this.getGenres();
        movieImg.alt = `${this.name}`;
        movieImg.title = `${this.name}\n${movieGenres}`;
        movieImg.classList.add('movie-img');
        movieDiv.appendChild(movieImg);
        this.resultDiv.appendChild(movieDiv);
        movieDiv.addEventListener('click', () => {
            this.modalDialog.getModalGenre().textContent = this.getGenres();
            this.modalDialog.getModalSummary().innerHTML = this.summary;
            modalDialog.setDisplayProperty('block');
        });
    }
    getGenres() {
        let genres = 'Genres:';
        if (this.genre.length === 0) {
            genres += ' not specified,';
        }
        else {
            for (let i = 0; i < this.genre.length; i++) {
                genres += ` ${this.genre[i]},`;
            }
        }
        genres = genres.substring(0, genres.length - 1);
        return genres;
    }
}
let resultArray;
//*********logic***************************************************************************
const api = 'https://api.tvmaze.com/search/shows?q=';
const selection = document.querySelector('.selection');
const resultDiv = document.querySelector('.result-list');
const modalDialog = new ModalDialog(document.getElementById('modalDialog'), document.querySelector('.genre'), document.querySelector('.summary'), document.querySelector('.modalButton'));
selection.addEventListener('change', async () => {
    const query = api + selection.value;
    const movies = await fetch(query)
        .then((response) => { return response.json(); });
    processMovies(movies);
    resultDiv.textContent = '';
    resultArray.forEach((movie) => {
        movie.addToWebPage();
    });
});
const processMovies = (movies) => {
    resultArray = movies.map((movie) => {
        const movieOuter = movie;
        const name = movieOuter.show.name;
        const genres = movieOuter.show.genres;
        let image = '';
        if (movieOuter.show.image !== null) {
            if (movieOuter.show.image.hasOwnProperty('original')) {
                image = movieOuter.show.image.original;
            }
            else if (movieOuter.show.image.hasOwnProperty('medium')) {
                image = movieOuter.show.image.medium;
            }
        }
        const summary = movieOuter.show.summary;
        const movieInfo = new MovieInfo(name, genres, image, summary, resultDiv, modalDialog);
        return movieInfo;
    });
};
