function main(){

    // Movie object constructor
    function Movie(title, director, duration, hasWatched, ID){
        
        this.tittle = title;
        this.director = director;
        this.duration = duration;
        this.hasWatched = hasWatched;
        this.ID = ID;
    }

    // toogle if user has watched a movie
    Movie.prototype.changeHasWatched = function() {
        
        switch (this.hasWatched){
            
            case true: this.hasWatched = false; break;
            
            case false: this.hasWatched = true; break;
        }
    }

    // append movie to library array
    function addMovieToLibrary(movie,movieID,library){
        
        library.set(movieID,movie);
        movieID++;
    }

    function removeFromLibray(movieID,library){
        
        library.delete(movieID);
    }

    // console log all movies in library array
    function showMoviesInLibrary(library){
        
        for (let [key,value] of library){
            
            console.table(key,value);
        }
    }

    // function to open "add a new movie" modal-form
    function openForm(){
        
        document.getElementById('modal-container').style.display = 'block';
    }

    //function that closes the modal-form and resets its fields
    function closeForm(){
        
        document.getElementById('modal-container').style.display = 'none';
        document.getElementById('title').value = '';
        document.getElementById('title').placeholder = 'e.g. The Lord Of The Rings: The Fellowship of the Ring';
        document.getElementById('director').value = '';
        document.getElementById('director').placeholder = 'e.g. Peter Jackson';
        document.getElementById('duration').value = '';
        document.getElementById('duration').placeholder = 'e.g. 178';
        document.getElementById('movie-seen-check').checked = false;
    }

    // validates user input on modal form
    function validation (title, director, duration){
        
        if (title === ''){

            document.getElementById('title').placeholder = 'Title field cannot be empty';

            return false;
            
        }else if (director ===''){
            
            document.getElementById('director').placeholder = 'Director field cannot be empty';

            return false;
        
        }else if (duration === 0){

            document.getElementById('duration').placeholder = 'Duration field cannot be empty';

            return false;

        }else if (isNaN(duration)){

            document.getElementById('duration').value = '';
            document.getElementById('duration').placeholder = 'Duration must be a Number e.g. 123';

            return false;
        
        }else{
            
            return true;
        }
    }

    // Variables
    const movieShowcase = document.getElementById('showcase');
    let userLibrary = new Map();
    let movieID = 0;
    let minutesSum = 0;
    let totalMoviesDOM = document.getElementById('total-movies-library-number');
    let totalWatchedDOM = document.getElementById('total-movies-watched-number')
    let totalMinutesDOM = document.getElementById('total-minutes-watched');

    // add a new movie button on application grid-area, opens modal form
    const addNewMovieBtn = document.getElementById('add-new-movie');
    addNewMovieBtn.addEventListener('click', () => {
        openForm();
    });

    // closes modal form
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    cancelFormBtn.addEventListener('click', () => {
        
        closeForm();
    });

    // submit new movie btn that appears on modal form
    const submitMovieBtn = document.getElementById('submit-movie-btn');
    submitMovieBtn.addEventListener('click', () => {
        
        let title = document.getElementById('title').value;
        let director = document.getElementById('director').value;
        let duration = Number(document.getElementById('duration').value);
        let hasWatched = document.getElementById('movie-seen-check').checked;
        
        if (validation(title, director, duration)){
            
            let newMovie = new Movie(title,director,duration,hasWatched,movieID);        
            addMovieToLibrary(newMovie,movieID,userLibrary);
            let movieDOMelement = MovieElementMaker(title,director,duration,hasWatched,movieID)
            movieShowcase.insertBefore(movieDOMelement,addNewMovieBtn);
            closeForm();
            
        }
    });

    // Movie DOM element constructor
    function MovieElementMaker(title,director,duration,hasWatched,movieID){
        
        // upon DOM element creation, increase Total Movies in Library
        totalMoviesDOM.innerHTML = String(Number(totalMoviesDOM.innerHTML) +1);
        
        let movieElement = document.createElement('div');
        movieElement.classList.add('movie-item')
        movieElement.classList.add('a-movie')
        movieElement.id = movieID;
        
        let movieTitle = document.createElement('div');
        movieTitle.classList.add('movie-title');
        movieTitle.innerHTML = `Title: ${title}`;
        movieElement.appendChild(movieTitle);
        
        let movieDirector = document.createElement('div');
        movieDirector.classList.add('movie-director');
        movieDirector.innerHTML = `Director: ${director}`;
        movieElement.appendChild(movieDirector);
        
        let movieDuration = document.createElement('div');
        movieDuration.classList.add('movie-duration');
        movieDuration.innerHTML = `Duration: ${duration} min`;
        movieElement.appendChild(movieDuration);
        
        let movieBtnContainer = document.createElement('div');
        movieBtnContainer.classList.add('amovie-btn-container');

        let watchedMovieBtn = document.createElement('BUTTON');
        watchedMovieBtn.classList.add('hasWatched-movie-btn');
        watchedMovieBtn.setAttribute('type','button');
        // configure text of button on init 
        switch(hasWatched){
            
            case(true) : 
                
                watchedMovieBtn.setAttribute('style','background-color: #3C6E71;');
                watchedMovieBtn.innerHTML = 'Watched'; break;

            case(false) : 
                

                watchedMovieBtn.setAttribute('style','background-color: #B3AF8F;')
                watchedMovieBtn.innerHTML = 'Not-Watched'; break;
        }
        
        // connect the Movie object with the DOM element
        let thisMovie = userLibrary.get(Number(movieElement.id));
        
        if(thisMovie.hasWatched){
            
            minutesSum += thisMovie.duration;
            totalMinutesDOM.innerHTML = String(minutesSum);
            totalWatchedDOM.innerHTML = String(Number(totalWatchedDOM.innerHTML) + 1);
        }
    
        watchedMovieBtn.addEventListener('click', () => {
            
            // change bool state of Movie obj connected to DOM element
            switch(thisMovie.hasWatched){
                
                case(true) :
                
                watchedMovieBtn.setAttribute('style','background-color: #B3AF8F;')
                watchedMovieBtn.innerHTML = 'Not-Watched'; 
                totalWatchedDOM.innerHTML = String(negativeCheck((Number(totalWatchedDOM.innerHTML) - 1 )));
                minutesSum -= thisMovie.duration;
                totalMinutesDOM.innerHTML = String(minutesSum);
                break;
                
                case(false): 
                
                watchedMovieBtn.setAttribute('style','background-color: #3C6E71;');
                watchedMovieBtn.innerHTML = 'Watched'; 
                totalWatchedDOM.innerHTML = String(Number(totalWatchedDOM.innerHTML) + 1 );
                minutesSum += thisMovie.duration;
                totalMinutesDOM.innerHTML = String(minutesSum);
                break;
            }
            thisMovie.changeHasWatched();
        });
        movieBtnContainer.appendChild(watchedMovieBtn);
        
        // create 2 span for 2 buttons on same line
        let deleteMovieBtnSpan = document.createElement('span');

        let deleteMovieBtn = document.createElement('BUTTON');
        deleteMovieBtn.classList.add('delete-movie-btn');
        deleteMovieBtn.setAttribute('type','button');
        deleteMovieBtn.innerHTML = '✖';

        
        deleteMovieBtn.addEventListener('click', () => {
            
            // on delete decrease HTML
            totalMoviesDOM.innerHTML = String(negativeCheck((Number(totalMoviesDOM.innerHTML) - 1 )));
            
            // if true decrease fields
            if(thisMovie.hasWatched){

                totalWatchedDOM.innerHTML = String((negativeCheck(Number(totalWatchedDOM.innerHTML) - 1 )));
                minutesSum -= thisMovie.duration;
                totalMinutesDOM.innerHTML = String(minutesSum);
            }
            
            removeFromLibray(Number(movieElement.id),userLibrary);
            movieElement.remove();
        });
        deleteMovieBtnSpan.appendChild(deleteMovieBtn);
        movieBtnContainer.appendChild(deleteMovieBtnSpan);
        movieElement.appendChild(movieBtnContainer);
        
        return movieElement;
    }

    function negativeCheck(x) {
    
        if (x < 0) {
            
            return x = 0;
        }
        return x;
    }
}

main();