// data definition

interface IImage{
    medium:string;
    original:string;
}

interface IMovieInfo {
    name:string;
    genres:string[];
    image:IImage;
    summary:string;
}

interface IMovieOuter {
    show:IMovieInfo;
}

class ModalDialog {
    private modalDialog:HTMLDivElement;
    private modalGenre:HTMLDivElement;
    private modalSummary:HTMLDivElement;
    private modalButton:HTMLButtonElement;
    
    constructor( modalDialog:HTMLDivElement, //reference to the modal dialog
        modalGenre:HTMLDivElement, //where the genres will be listed in the modal dialog
        modalSummary:HTMLDivElement, //where the summary will be shown in the modal dialog
        modalButton:HTMLButtonElement
    ){
        this.modalDialog = modalDialog;
        this.modalGenre = modalGenre;
        this.modalSummary = modalSummary;
        this.modalButton = modalButton;

        this.modalButton.addEventListener('click', () => {
            modalDialog.style.display = 'none';
        });
    }

    public getModalDialog():HTMLDivElement{
        return this.modalDialog;
    }

    public getModalGenre():HTMLDivElement{
        return this.modalGenre;
    }

    public getModalSummary():HTMLDivElement{
        return this.modalSummary;
    }

    public setDisplayProperty(value:string){
        this.modalDialog.style.display = value;
    }
}

class MovieInfo {
    private name:string;
    private genre:string[];
    private image:string;
    private summary:string;
    private resultDiv:HTMLDivElement;
    private modalDialog:ModalDialog;

    constructor(name:string, genre:string[], image:string, summary:string,
        resultDiv:HTMLDivElement, //where the list will be put
        modalDialog:ModalDialog,
    ){
        this.name = name;
        this.genre = genre;
        this.image = image;
        if(summary === null){
            this.summary = 'Summary not found';
        } else {
            this.summary = summary;
        }
        this.resultDiv = resultDiv;
        this.modalDialog = modalDialog;

    }

    public addToWebPage(){
        const movieDiv:HTMLDivElement = document.createElement('div');
        movieDiv.classList.add('movie-div');
        const movieImg:HTMLImageElement = document.createElement('img');
        if(this.image !== ''){
            movieImg.src = this.image;
        }
        const movieGenres:string = this.getGenres();
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

    private getGenres():string {
            let genres:string = 'Genres:';
            if(this.genre.length === 0){
                genres += ' not specified,'
            } else {
                for(let i = 0; i < this.genre.length; i++ ){
                    genres += ` ${this.genre[i]},`;
                }
            }
            
            genres = genres.substring(0, genres.length - 1);
        
            return genres;
    }
}

let resultArray:MovieInfo[];

//*********logic***************************************************************************

const api = 'https://api.tvmaze.com/search/shows?q=';
const selection = document.querySelector('.selection') as HTMLSelectElement;
const resultDiv = document.querySelector('.result-list') as HTMLDivElement;

const modalDialog:ModalDialog = new ModalDialog(document.getElementById('modalDialog') as HTMLDivElement,
                                                document.querySelector('.genre') as HTMLDivElement,
                                                document.querySelector('.summary') as HTMLDivElement,
                                                document.querySelector('.modalButton') as HTMLButtonElement);

selection.addEventListener('change', async() => {
    const query = api + selection.value;
    
    const movies:JSON[] = await fetch(query)
    .then((response) => { return response.json()});

    processMovies(movies);

    resultDiv.textContent = '';
    resultArray.forEach((movie) => {
        movie.addToWebPage();
    });
});

const processMovies = (movies:JSON[]) => {
    resultArray = movies.map((movie) => {

        const movieOuter:IMovieOuter = (movie as unknown) as IMovieOuter;
        const name:string = movieOuter.show.name;
        const genres:string[] = movieOuter.show.genres;
        let image:string = '';
        if(movieOuter.show.image !== null ){
            if(movieOuter.show.image.hasOwnProperty('original')){
                image = movieOuter.show.image.original;
            } else if (movieOuter.show.image.hasOwnProperty('medium')) {
                image = movieOuter.show.image.medium;
            }
        }
        const summary:string = movieOuter.show.summary;

        const movieInfo:MovieInfo = new MovieInfo(name, genres, image, summary, resultDiv, modalDialog);
        return movieInfo;
    });

};