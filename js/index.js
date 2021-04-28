let searchInput;

const baseUrl = "https://scmq7n.a.searchspring.io/api/search/search.json";

  //create promise
  const getItems = ( query, pageNumber ) => {
    
    return new Promise(( resolve ) => {

      fetch(baseUrl + '?' + new URLSearchParams({
        q: query,
        resultsFormat: 'native',
        page: pageNumber,
        siteId: 'scmq7n'
      })).then(response => response.json())
        .then(data => { 
          console.log(data);
          
          resolve( data );
        })
        .catch(error => {
          console.log( error );
      })
  
    })
  };

  

$(document).ready(() => {


  //Event listener to register when a user clicks enter in the search input field to search for items
  $('#search-input').keyup((event) => {
    //Hide pagination-cont for when a user makes another search
    $('#pagination-cont').hide();
    if(event.keyCode === 13) {
    searchInput = $('#search-input').val();
    getItems( searchInput, 1 );
    }
  })
  //Event listener to register when a user clicks the search-submit button or tabs over and clicks enter to search for items
  $('#search-submit').click(() => {
    //Hide pagination-cont for when a user makes another search
    $('#pagination-cont').hide();
    searchInput = $('#search-input').val();
    getItems( searchInput, 1 );
  })


})  
  