const GetActorsInf0 = async (actorid) => {
    const url = `https://api.themoviedb.org/3/person/${actorid}?language=pt-BR`;
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
      document.getElementById('Nome').textContent = `${data.name}`;
      document.getElementById('ocupacao').textContent = `${data.known_for_department}`;
      document.getElementById('localnasci').textContent = `${data.place_of_birth}`;
      document.getElementById('aniversario').textContent = `Nascimento: ${data.birthday}`;
      document.getElementById('biography').textContent = `Nascimento: ${data.biography}`;

      if (data.profile_path) {
        const imagem = document.createElement('img');
        imagem.src = `https://image.tmdb.org/t/p/w300${data.profile_path}`;
        imagem.classList.add('foto');
        document.getElementById('fotoator').appendChild(imagem);
      } else {
        console.log('O ator não possui uma imagem de perfil disponível.');
      }
    } 
    catch (err) {
    console.error('error:', err);

    }
  };
const getActorMovie = async(actorid) =>{

  const url = `https://api.themoviedb.org/3/person/${actorid}/movie_credits?language=en-US`;
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

    if (data.cast && data.cast.length > 0) {
      const postersDiv = document.getElementById('posters');

      data.cast.slice(0, 8).forEach((movie) => {
        if (movie.poster_path) {
          const imagem = document.createElement('img');
          imagem.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          imagem.classList.add('posterimg');
          postersDiv.appendChild(imagem);
        } else {
          console.log(`O filme "${movie.title}" não possui um poster disponível.`);
        }
      });
    } else {
      console.log('Este ator não tem créditos de filmes disponíveis.');
    }
  } catch (error) {
    console.error('error:', error);
  }
};

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
getActorMovie(id);
// Exemplo de uso
GetActorsInf0(id);
