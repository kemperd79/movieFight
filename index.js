const apiURL = 'https://www.omdbapi.com/'
const myAPIKey = '121478d';

const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}"/>
        ${movie.Title}
        (${movie.Year})
    `;
    },
     inputValueOnClick(movie){
        return movie.Title;
    }, 
    async fetchData(searchTerm) {
        const res = await axios.get(apiURL, {
            params: {
                apikey : myAPIKey
                , s: searchTerm
            }
        });
        
        if (res.data.Error) {
            return [];
        }
        return res.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    rootElement : document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'),'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    rootElement : document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'),'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement,side) =>{
    
    const res = await axios.get(apiURL, {
        params: {
            apikey : myAPIKey
            , i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(res.data);

    if(side === 'left'){
        leftMovie = res.data;
    } else {
        rightMovie = res.data;
    }

    if(leftMovie && rightMovie){
        runComparison(leftMovie, rightMovie);
    }

    if (res.data.Error){
        return [];
    }
    return res.data;
}

const runComparison = (leftMovie, rightMovie ) => {
    const leftSummaryElements = document.querySelectorAll('#left-summary .notification');
    const rightSummaryElements = document.querySelectorAll('#right-summary .notification');

    leftSummaryElements.forEach((leftStat, index) => {
        const rightStat = rightSummaryElements[index];
        
        const leftValue = parseInt(leftStat.dataset.value);
        const rightValue = parseInt(rightStat.dataset.value);

        if(rightValue > leftValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else if (rightValue < leftValue){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }


        console.log(leftStat,rightStat);
    });
}

const movieTemplate = (movieDetail) => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) =>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }
        return prev + value;
    },0);
    // let count = 0;
    // const awards = movieDetail.Awards.split(' ').forEach((word)=>{
    //     const value = parseInt(word);
    //     if(isNaN(value)){
    //         return;
    //     }
    //     count = count + value;
    // });
 

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary" data-value=${awards}>
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary" data-value=${dollars}>
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary" data-value=${metaScore}>
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary" data-value=${imdbRating}>
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary" data-value=${imdbVotes}>
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}
