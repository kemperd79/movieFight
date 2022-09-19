// debounce delay default
const debounceDelay = 1000;

// limit the # calls to the API, wait for a second of non typing 
// before calling the API func or any other function
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        },delay)
    };
};