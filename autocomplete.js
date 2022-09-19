// Autocomplete widget using Bulma.io styling framework
//    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.css"/>


const createAutoComplete = ({
        rootElement,   // HTML element to anchor to
        fetchData, // data for autocomplete list
        renderOption,  // function that returns HTML to render each autocomplete list item
        onOptionSelect,  // function to run upon selecting a autocomplete list item
        inputValueOnClick // value of the input text box after a autocomplete list item is clicked
}) => {

    rootElement.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />    
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
        `;
    
    const input = rootElement.querySelector('input');
    const autocompleteDropDown = rootElement.querySelector('.dropdown');
    const autocompleteDropDownContents = rootElement.querySelector('.dropdown-content');
    
//debounce an input
const onInput =  debounce( async (event) => {
    const items = await fetchData(event.target.value);

    if(!items.length){
        autocompleteDropDown.classList.remove('is-active');
        return;
    }

    autocompleteDropDownContents.innerHTML = '';
    autocompleteDropDown.classList.add('is-active');

    for (let item of items) {
        const option = document.createElement('a');
        
        option.classList.add('dropdown-item');
        
        option.addEventListener('click',(event)=>{
            autocompleteDropDown.classList.remove('is-active');
            input.value = inputValueOnClick(item);
            onOptionSelect(item);
        });
        
        option.innerHTML= renderOption(item);

        autocompleteDropDownContents.appendChild(option);
    }

}, debounceDelay);

// event listener for text input
input.addEventListener('input', onInput);

    document.addEventListener('click',(event) =>{
        //console.log(event.target);
        if(!rootElement.contains(event.target)){
            autocompleteDropDown.classList.remove('is-active');
        }
    });

}