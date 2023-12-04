//Repassa titulo, sinopse, poste e avaliação do filme
const getMoviesByImdbID = async (id) => {
    const url = `https://api.themoviedb.org/3/find/${id}?language=pt-BR&external_source=imdb_id`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjhiYzNlMDE3ZmU5MDVjYWMxOTg5NmMwZDY4ZTk2MCIsInN1YiI6IjY1MmVlZWFhMGNiMzM1MTZmNjQwN2Q3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LKP2asLbQUo_of8JRAw5sssiMKK6Du7CD7bRgDk7Fk'
        }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        const result = data.movie_results.length > 0 ? data.movie_results[0] : null;


        if (result) {
            const container = document.getElementById('titulofilme');
            const container2 = document.getElementById('sinopse')
            const container3 = document.getElementById('poster')
            const container4 = document.getElementById('notas')

            const titulo = document.createElement('p');
            titulo.textContent = `${result.title}`;
            container.appendChild(titulo);


            const overview = document.createElement('p');
            overview.textContent = ` ${result.overview || 'Nenhuma visão geral disponível'}`;
            container2.appendChild(overview);


            if (result.poster_path) {
                const poster = document.createElement('img');
                poster.src = `https://image.tmdb.org/t/p/w500/${result.poster_path}`;

                poster.width = 167;

                container3.appendChild(poster);

                const voteAverage = document.createElement('p');
                voteAverage.textContent = `Nota: ${result.vote_average || 'Não disponível'}`;
                container4.appendChild(voteAverage);
            }
        } else {
            console.log('Filme não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do filme:', error);
    }
}

//repassa atores do filme
const getMoviesByImdbID2 = async (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjhiYzNlMDE3ZmU5MDVjYWMxOTg5NmMwZDY4ZTk2MCIsInN1YiI6IjY1MmVlZWFhMGNiMzM1MTZmNjQwN2Q3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LKP2asLbQUo_of8JRAw5sssiMKK6Du7CD7bRgDk7Fk'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {


            if (json.cast) {
                const cast = json.cast;


                const atoresDiv = document.getElementById('atores');

                const listaAtores = document.createElement('ul');


                for (let i = 0; i < 12; i++) {
                    const actor = cast[i];
                    if (actor) {
                        const lista = document.createElement('li');
                        lista.textContent = actor.name;
                        lista.addEventListener('click', async () => {
                            // Neste exemplo, redirecionamos para a página do filme com base no ID do IMDB
                            window.location.href = `atores.html?id=${actor.id}`;
                        })
                        listaAtores.appendChild(lista);
                    }
                }


                atoresDiv.appendChild(listaAtores);
            } else {
                console.log('Nenhum elenco encontrado.');
            }
        })
        .catch(err => console.error('error:' + err));
}


//Repassa reviews
const getReviews = async (id) => {

    const url = `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjhiYzNlMDE3ZmU5MDVjYWMxOTg5NmMwZDY4ZTk2MCIsInN1YiI6IjY1MmVlZWFhMGNiMzM1MTZmNjQwN2Q3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LKP2asLbQUo_of8JRAw5sssiMKK6Du7CD7bRgDk7Fk'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            const reviewDiv = document.getElementById('review');

            const reviews = json.results;

            if (reviews && reviews.length > 0) {
                const primeiraAnalise = reviews[0].content;
                const paragrafo = document.createElement('p');
                paragrafo.textContent = primeiraAnalise;
                reviewDiv.appendChild(paragrafo);
            } else {
                reviewDiv.textContent = 'Nenhuma análise disponível.';
            }
        })
        .catch(err => console.error('error:' + err));
}


//Repassa informação dos streamings
const getStreaming = async (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjhiYzNlMDE3ZmU5MDVjYWMxOTg5NmMwZDY4ZTk2MCIsInN1YiI6IjY1MmVlZWFhMGNiMzM1MTZmNjQwN2Q3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LKP2asLbQUo_of8JRAw5sssiMKK6Du7CD7bRgDk7Fk'
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            const streamingsDiv = document.getElementById('streaming');

            if (json.results.BR) {
                const providers = json.results.BR.flatrate;

                if (providers && providers.length > 0) {
                    const streamingNames = providers.map(provider => provider.provider_name);

                    streamingNames.slice(0, 5).forEach(providerName => {
                        const streamingItem = document.createElement('p');
                        streamingItem.textContent = providerName;
                        streamingsDiv.appendChild(streamingItem);
                    });
                } else {
                    streamingsDiv.textContent = 'Nenhum serviço de streaming disponível no Brasil.';
                }
            } else {
                streamingsDiv.textContent = 'Informações de streaming não encontradas para o Brasil.';
            }
        })
        .catch(err => console.error('Erro:', err));
}

//Esse código é o id do Imdb de um filme usando como exemplo, pode ser alterado para testar funcionalidade
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
getMoviesByImdbID(id)
getMoviesByImdbID2(id)
getReviews(id)
getStreaming(id)

const stars = document.querySelectorAll('.estrela-img');
const ratingValue = document.getElementById('rating-value');
const commentInput = document.getElementById('comment-input');
const submitCommentButton = document.getElementById('submit-comment');
const commentList = document.getElementById('comment-list');
const rankingList = document.getElementById('ranking-list');
let rating = 0
const reviews = [];

stars.forEach((estrelaImg) => {
    estrelaImg.addEventListener('click', () => {
        rating = estrelaImg.getAttribute('data-avaliacao');
        ratingValue.textContent = `Avaliação: ${rating} estrela${rating > 1 ? 's' : ''}`;

        stars.forEach((s) => s.classList.remove('active'));

        for (let i = 0; i < rating; i++) {
            stars[i].classList.add('active');
        }

    });
});

submitCommentButton.addEventListener('click', (event) => {
    event.preventDefault();
    const commentText = commentInput.value;
    const review = {
        rating: rating,
        comment: commentText,
    }
    fetch('http://localhost:3000/avaliacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    })
        .then(response => response.json())
    for (let i = 0; i < rating; i++) {
        stars[i].classList.remove('active');
    }
    commentInput.value = '';
    rating = 0;
    reviews.push(review);
    reviews.sort((a, b) => b.rating - a.rating);
    updateRanking();
    console.log(reviews);

    if (commentText) {
        addComment(commentText);
        commentInput.value = '';
    }
});

function addComment(commentText) {
    const commentItem = document.createElement('li');
    commentItem.textContent = commentText;
}

function updateRanking() {
    rankingList.innerHTML = '';
    console.log(reviews);
    reviews.forEach((review, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Posição ${index + 1}: ${review.rating} estrela${review.rating > 1 ? 's' : ''} - ${review.comment}`;
        rankingList.appendChild(listItem);
    });
}


