
console.log('Client side javascript file is loaded!')

const getWeatherData = (address, callBack) => {
    fetch(`http://localhost:3000/weather?address=${address}`).then((response) => {
        response.json().then((data) => {
            if(data.error){
                callBack(false, data.error)
            } else {
                callBack(true, data)
            }
        })
    })
};

const weatherForm = document.getElementById('loc-form')
const searchItem = document.getElementById('input-form')
const result = document.getElementById('show-result')

weatherForm.addEventListener('submit', (e) => {
    getWeatherData(searchItem.value, (isSuccess, data) => {
        console.log(data)
        result.style.color = isSuccess ? 'green' : 'red';
        result.style.marginTop = "5px";
        result.innerHTML = isSuccess ? data.address : data
    })
    e.preventDefault();
})