let searchInput;
$('#pagination-cont').hide();

const baseUrl = "https://scmq7n.a.searchspring.io/api/search/search.json";

  //create promise
  const getItems = ( query, pageNumber ) => {
    console.log(query);
    return new Promise(( resolve ) => {
      
      fetch(baseUrl + '?' + new URLSearchParams({
        q: searchInput,
        resultsFormat: 'native',
        page: pageNumber,
        siteId: 'scmq7n'
      })).then(response => response.json())
        .then(data => { 
          console.log(data);
          
          //If the totalPages are greater than 1
          let pagination = data.pagination;
          if(pagination.totalPages > 1) showPaginationLogic( pagination );

          createItemTemplate( query, data );
          resolve( data );
        })
        .catch(error => {
          console.log( error );
      })
  
    })
  };


  


//Function that takes in the retrieved data and loops through and builds an HTML template for each result that is then injected into my grid element
  const createItemTemplate = ( query, data ) => {
    
    let results = data.results;
    let resultTemplate = "";

    generateMessage( query, data ); 

      for(let result of results) {
        if(result.on_sale[0] === "Yes" ) {
          resultTemplate += `
            <div class="grid-item">
              <img class="item-img" src="${ result.thumbnailImageUrl }" />
              <div class="item-info">
                <p class="item-name">${ result.name }</p>
                <div class="d-flex">
                  <p><span class="item-og-price">$${( result.msrp * 1 ).toFixed(2)}</span>
                  <span class="current-price">$${( result.price * 1 ).toFixed(2)}</span>
                  </p>
                  <i class="fas fa-plus-circle add-to-cart"></i> 
                </div>   
              </div>  
            </div> 
          `;
        }
        else {
        resultTemplate += `
          <div class="grid-item">
            <img class="item-img" src="${ result.imageUrl }" onError="this.onerror=null;this.src='img/img-not-avail.png';"/>
            <div class="item-info">
              <p class="item-name">${ result.name }</p>
              <div class="d-flex">
                <p class="current-price">
                $${( result.price * 1 ).toFixed(2)}
                </p>
                <div class="add-to-cart">
                  <i class="fas fa-plus-circle"></i>
                </div>  
              </div>
            </div>  
          </div>  
        `;
        }
      }
      $('#result-cont').html(resultTemplate);
      window.scroll({top: 0});
  }

  //This function will generate a message to be displayed in the HTML depending on if the user is on the home page, or has done a search
  const generateMessage = ( query, data ) => {
    let message = "";
  
    //If/Else utilized to determine what message to generate depending on passed query and data value
    if( query === '#beach#!') {
      message += `
        <h3 class="msg">Welcome to Island Native, you can search our merchandise for all of your beach needs. <br><br>Off season items available!</h3>
      `;
      //This if statement will remove the homepage message if the currentPage value is greater than 1
      if(data.pagination.currentPage > 1) {
        message = "";
      }
    }
    else {
      if(data.results.length === 0) {
        let didYouMean = data.didYouMean.query;

        message +=  `
          <h4 class="msg">We didn't find any results for ${query}, did you mean <span class="did-you-mean" data-id="${didYouMean}">"${didYouMean}"</span>?</h4>
        `;
      }
      else {
        message += `
        <h4 class="msg">Search results for ${data.breadcrumbs[0].filterValue}</h4>
        `;
      }
    
    }
    $('#msg-cont').html(message);
  } 

  //This function will first display the pagination container, set the values of the pagination elements, then go through various conditionals to properly hide and show the pagination elements depending on the values of the previousPage, currentPage, and nextPage values retrieved from the API
  const showPaginationLogic = ( pagination ) => {

    $('.pagination-cont').show();
    $('.previous-page').hide();

    //Here I set the values of the pagination elements
    $('.previous-page').val(pagination.previousPage);
    $('.page-number').val(pagination.currentPage).text(`Page ${pagination.currentPage}`);
    $('.next-page').val(pagination.nextPage);

    //Conditionals to handle hiding and showing the 'previous-page and 'next-page' pagination buttons depending on values retrieved from the API
    if(pagination.previousPage !== 0) $('.previous-page').show();

    $('.next-page').show();
    if(pagination.nextPage === 0) $('.next-page').hide();
    
  }

  const generatePagination =() => {
    return `
      <div class="prev-next-cont">
        <button class="pagination-btn previous-page"><i class="fas fa-chevron-left"></i><Previous Page></button>
      </div>

      <div>
        <p class="page-number"></p>
      </div>
  
      <div class="prev-next-cont">
      <button class="pagination-btn next-page"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;
  }

//These functions and event listeners are made available after the document is in a ready state  
$(document).ready(() => {

  //Default items displayed on page on load
  const homepage = () => {
    searchInput = '#beach#!';
    $('#search-input').val("");
    getItems( searchInput, 1 );

    //Will inject the pagination template to HTML
    $('.pagination-cont').html(generatePagination());
  }
  homepage();


  //On click event listener to call 'homepage()'
  $('.logo').click(() => { homepage(); })


  //Event listener to register when a user clicks enter in the search input field to search for items
  $('#search-input').keyup((event) => {
    //Hide pagination-cont for when a user makes another search
    $('.pagination-cont').hide();
    if(event.keyCode === 13) {
    searchInput = $('#search-input').val();
    getItems( searchInput, 1 );
    }
  })
  //Event listener to register when a user clicks the search-submit button or tabs over and clicks enter to search for items
  $('#search-submit').click(() => {
    //Hide pagination-cont for when a user makes another search
    $('.pagination-cont').hide();
    searchInput = $('#search-input').val();
    getItems( searchInput, 1 );
  })


  //Handle other searches based on click events on defined tab values in the navbar
  $(document).on("click", ".search-term", function() {
    searchInput = $(this).data("id");
    $('#search-input').val(searchInput);
    getItems( searchInput, 1 );
  });


  //Cart functionality
  let itemsInCart = 0;
  $(document).on('click', '.add-to-cart', () => {
    //onclick add a value of 1 to the 'span' element with the parent element that has a class of cart and allow it to increment with each click. Also add the class of 'cart-count' if the value is 0.

    itemsInCart++;
    $('#cart-count').attr('class', 'cart-count').text(itemsInCart);
  })


  //Pagination handling
  $('.previous-page').click(() => {
    let currentPage = ( $('.page-number').val() * 1);
    currentPage--;
    getItems( searchInput, currentPage );
  })

  $('.next-page').click(() => {
    let currentPage = ( $('.page-number').val() * 1);
    currentPage++;
    getItems( searchInput, currentPage );
  })

  //Event listener to handle if the API can't match the search query and has a 'did-you-mean' value
  $(document).on("click", ".did-you-mean", function() {
    searchInput = $(this).data("id");
    $('.did-you-mean').val(searchInput);
    getItems( searchInput, 1 );
  });


  //Event listener to handle going to the homepage when a user clicks on the logo in the footer
  $('.logo-footer').click(() => {
    homepage();
  })
}) 