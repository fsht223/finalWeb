function displayJoke(jokeData) {
    const jokesContainer = document.getElementById('jokes-container'); 
    jokesContainer.innerHTML = '';

    const jokeElement = document.createElement('p');
    jokeElement.textContent = jokeData; 

    jokesContainer.appendChild(jokeElement);
}

async function getRandomJoke() {
    const options = {
        method: 'GET',
        url: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random',
        headers: {
            accept: 'application/json',
            'X-RapidAPI-Key': '3b096e52damsh93a39414bd07a19p1cd349jsnffdf6feb5cc6',
            'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data.value);
        displayJoke(response.data.value); // Call displayJoke with the response data
    } catch (error) {
        console.error(error);
    }
}


async function getRandomQuote() {
    const url = 'https://random-quote-generator6.p.rapidapi.com/generate';
    const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '3b096e52damsh93a39414bd07a19p1cd349jsnffdf6feb5cc6',
          'X-RapidAPI-Host': 'random-quote-generator6.p.rapidapi.com'
        }
      };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      // Assuming result is an array and taking the first fact, or adjust based on the actual structure
      const quote = result.quote || "No quote found."; // Adjust based on actual API response
      
      const funQuoteInfoDiv = document.getElementById('funQuoteInfo');
      funQuoteInfoDiv.innerHTML = `<p>${quote}</p>`;
    } catch (error) {
      console.error('Error fetching fun quote:', error);
    }
}


async function fun() {
    const url = 'https://fun-facts1.p.rapidapi.com/api/fun-facts';
    const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '3b096e52damsh93a39414bd07a19p1cd349jsnffdf6feb5cc6',
          'X-RapidAPI-Host': 'fun-facts1.p.rapidapi.com'
        }
      };
  
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      // Assuming result is an array and taking the first fact, or adjust based on the actual structure
      const fact = result.fact || "No fact found."; // Adjust based on actual API response
      
      const funFactInfoDiv = document.getElementById('funFactInfo');
      funFactInfoDiv.innerHTML = `<p>${fact}</p>`;
    } catch (error) {
      console.error('Error fetching fun fact:', error);
    }
}