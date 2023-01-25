export { PageList }

const API_KEY  = 'e89c5c5a2d19448b8fa6d3676be23249';



const PageList = (argument = '') => {
  const preparePage = () => {
    const cleanedArgument = argument.trim().replace(/\s+/g, '-');

    const fetchPublisherAndDeveloper = async (id) => {
      try {
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        const data = await response.json();
        let publisher = "N/A";
        let developer = "N/A";
        if (data.publishers && data.publishers[0]) {
          publisher = data.publishers[0].name;
        }
        if (data.developers && data.developers[0]) {
          developer = data.developers[0].name;
        }
        return { publisher, developer };
      } catch (error) {
        console.log(error);
      }
    };

    const displayResults = async (articles) => {
      const resultsContent = await Promise.all(articles.map(async (article) => {
        const { publisher, developer } = await fetchPublisherAndDeveloper(article.id);
        return `
        <div id="top10">
        <div id="container">
        <div class="product-details">

        <h1>${article.name}</h1>
    
            <p class="information">" J'arrive pas a trouver la description du jeu AHHHHHHHHHHHHHHHHHHHHHH "</p>
    
    
          <div class="control">
    
            <button class="btn">
    
            <span class="buy"><a href="#pagedetail/${article.id}">${article.id}</a></span>
          </button>
    
          </div>
    
        </div>
    
      <div class="product-image">
    
        <img src="${article.background_image}" alt="">
    
    
      <div class="info">
        <h2> Description</h2>
        <ul>
          <li><strong>Release date : </strong>${article.released}</li>
          <li><strong>Editor : </strong>${publisher}</li>
          <li><strong>developpeur: </strong>${developer}</li>
          
        </ul>
      </div>
      </div>
    
    </div>
    </div>
    `;}));
    const resultsContainer = document.getElementById('games');
    resultsContainer.innerHTML = resultsContent.join("\n");
    };
        

    const fetchList = (url, argument) => {
      const finalURL = argument ? `${url}&search=${argument}` : url;
      fetch(finalURL)
        .then((response) => response.json())
        .then((responseData) => {
          // ne récupère que les 10 premiers éléments
          const topTen = responseData.results.slice(0, 10);
          displayResults(topTen)
          console.log(topTen)
        });
    };
    let today = new Date().toISOString().slice(0, 10)
    let futur = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().slice(0, 10)
    fetchList(`https://api.rawg.io/api/games?dates=${today},${futur}&ordering=-added&key=${API_KEY}`, cleanedArgument, {mode: 'no-cors'});
   
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles">Loading...</div>
      </section>
    `;

    preparePage();
  };

  render();
};


async function searchGames() {
  // Récupération de la valeur entrée dans la barre de recherche
  let input = document.getElementById("search").value;
  // Récupération des jeux correspondant à la valeur entrée
  const resp = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&search=${input}`);
  const data = await resp.json();
  console.log(data);

  let output = "";
  data.results.forEach((element) => {
    output +=   `
    <div id="container">	
        
        <div class="product-details">
          
        <h1>${element.name}</h1>

          
            <p class="information">" J'arrive pas a trouver la description du jeu AHHHHHHHHHHHHHHHHHHHHHH "</p>

          
          
      <div class="control">
        
        <button class="btn">

        <span class="buy"><a href="#pagedetail/${element.id}">${element.id}</a></span>
      </button>
        
      </div>
            
      </div>
        
      <div class="product-image">
        
        <img src="${element.background_image}" alt="">
        

      <div class="info">
        <h2> Description</h2>
        <ul>
          <li><strong>Release date : </strong>${element.released}</li>
          <li><strong>Editor : </strong> <span id="publisher${element.id}"></span></li>
          <li><strong>developpeur: </strong> <span id="developer${element.id}"></span></li>
        </ul>
      </div>
      </div>

    </div>
    `;
  });

  const fetchPublisherAndDeveloper = async (id) => {
    try {
      const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
      const data = await response.json();
      console.log(data)
      let publisher = "N/A";
      let developer = "N/A";
      if (data.publishers && data.publishers[0]) {
        publisher = data.publishers[0].name;
      }
      if (data.developers && data.developers[0]) {
        developer = data.developers[0].name;
      }
      document.getElementById(`publisher${id}`).innerHTML = publisher;
      document.getElementById(`developer${id}`).innerHTML = developer;
    } catch (error) {
      console.log(error);
    }
  };
  // Appel de la fonction pour récupérer les détails de l'éditeur et du développeur pour chaque jeu
  data.results.forEach(game => fetchPublisherAndDeveloper(game.id));
  // Affichage des jeux filtrés dans la page
  document.getElementById("games").innerHTML = output;
}

let button = document.getElementById("search-button");
button.addEventListener("click", searchGames);


