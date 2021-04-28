let searchInput;
$('#pagination-cont').hide();

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
          
          createItemTemplate( data );
          resolve( data );
        })
        .catch(error => {
          console.log( error );
      })
  
    })
  };

  //Function that takes in the retrieved data and loops through and builds an HTML template for each result that is then injected into my grid element
  const createItemTemplate = ( data ) => {
    
    let results = data.results;
    let resultTemplate;

      for(let result of results) {
        if(result.on_sale[0] === "Yes" ) {
          resultTemplate += `
            <div class="grid-item">
              <img class="item-img" src="${ result.imageUrl }" />
              <div class="item-info">
                <p class="item-name">${ result.name }</p>
                <p><span class="item-og-price">$${( result.price * 1 ).toFixed(2)}</span>
                <span class="current-price">$${( result.sale_price[0] * 1 ).toFixed(2)}</span>
                </p>
              </div>  
            </div> 
          `;
        }
        else {
        resultTemplate += `
          <div class="grid-item">
            <img class="item-img" src="${ result.imageUrl }" />
            <div class="item-info">
              <p class="item-name">${ result.name }</p>
              <p class="current-price">$${( result.price * 1 ).toFixed(2)}</p>
            </div>  
          </div>  
        `;
        }
      }
      $('#result-cont').html(resultTemplate);
  }

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
  