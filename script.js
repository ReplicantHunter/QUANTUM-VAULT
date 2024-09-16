const articleList = document.getElementById('articleList');
const searchInput = document.getElementById('searchInput'); // Get the search input element
const searchButton = document.getElementById('searchButton'); // Get the search button

let articles = []; // Store articles globally for search purposes

// Function to fetch and display article titles on the main page
function fetchIssues() {
    // Fetch open issues from the GitHub API
    fetch('https://api.github.com/repos/ReplicantHunter/QUANTUM-VAULT/issues?state=open')
        .then(response => {
            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(issues => {
            articleList.innerHTML = ''; // Clear previous articles
            articles = issues; // Store issues globally for search use

            if (issues.length === 0) {
                // Display a message if no articles are found
                const noArticlesMessage = document.createElement('p');
                noArticlesMessage.textContent = 'No articles available at the moment.';
                articleList.appendChild(noArticlesMessage);
            } else {
                displayArticles(issues); // Call function to display all articles
            }
        })
        .catch(error => {
            console.error('Error fetching issues:', error);

            // Display an error message if something goes wrong
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Failed to load articles. Please try again later.';
            articleList.appendChild(errorMessage);
        });
}

// Function to display articles
function displayArticles(articlesToDisplay) {
    articleList.innerHTML = ''; // Clear the article list
    articlesToDisplay.forEach(issue => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        // Create a link to the individual article page
        const articleLink = document.createElement('a');
        articleLink.href = `article.html?id=${issue.number}`; // Link to article.html with the issue number
        articleLink.textContent = issue.title; // Display the title of the issue

        // Add the link to the article div and append to the article list
        articleDiv.appendChild(articleLink);
        articleList.appendChild(articleDiv);
    });
}

// Function to handle search
function searchArticles() {
    const query = searchInput.value.toLowerCase(); // Get the search input and convert to lowercase
    const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(query)); // Filter articles based on the query

    if (filteredArticles.length === 0) {
        articleList.innerHTML = '<p>No articles match your search.</p>';
    } else {
        displayArticles(filteredArticles); // Display the filtered articles
    }
}

// Event listener for search button click
searchButton.addEventListener('click', searchArticles);

// Event listener for "Enter" key in the search input
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchArticles(); // Trigger the search function
    }
});

// Fetch issues when the main page loads
if (articleList) {
    window.onload = fetchIssues;
}
