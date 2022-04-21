//keys and endpoints
const covid19_endpoint = "https://covid-api.mmediagroup.fr/v1";

const shutter_key = 'UiEPxAr3OAl7YWKjb6rMe19UTMaHnRyo';
const shutter_secret = "JWinfASHpH2i3d7A";
const shutter_tocken = "v2/VWlFUHhBcjNPQWw3WVdLamI2ck1lMTlVVE1hSG5SeW8vMzI4OTMyMzQwL2N1c3RvbWVyLzQvZ3pDdTNMQnNGanRVUnlCRjdNWmlGMGkxMDFKVm00QmRTa0ctd2pfaVFJWVRrS25PR1FYcW9WaGUyUml4empHY2hrNWhwWjNpenBzR3VYUGI5R2wtelpaZ1ZvcTdoNlVScVZlV2VMdFdDMjlNUk15cXJvR0Y2SkIyVUZ2ZHQ5U0dEeDI4V09vdmY5WnRBRmk2U1hHdnNxY0dGdFlpRl9aVFNTOGdUd0NmTW5HTHBNQXowejBWTUlrcHF0X19yMXRQX1p1OWJqSGxUT19hZzU3NFhyOGgwZy9zXzhlV3VJZU5kc2czUFNGYnpMdF9n";
const shutter_endpoint = "https://api.shutterstock.com/v2/images/search?query=";
function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function onJsonCovid(json) {
    console.log('JSON covid ricevuto');
    const modale = document.querySelector('#modale');
    // Stampiamo il JSON per capire quali attributi ci servono
    console.log(json);
    const cases = json.All.confirmed;
    const deaths = json.All.deaths;
    const paragraph = document.createElement('div');
    modale.appendChild(paragraph);
    const parText = document.createElement('p');
    paragraph.appendChild(parText);
    parText.innerText = "Casi registrati: " + cases + "\n"  + "Morti registrate: " + deaths;
    fetch(covid19_endpoint + "/vaccines?country=Italy").then(onResponse).then(onJsonVaccination);

}

function onJsonVaccination(json){
    console.log('JSON covid ricevuto');
    // Stampiamo il JSON per capire quali attributi ci servono
    console.log(json);
    const Vaccinated = json.All.people_vaccinated;
    const partiallyVaccinated = json.All.people_partially_vaccinated;
    const modale = document.querySelector('#modale');
    const paragraph = document.createElement('div');
    modale.appendChild(paragraph);
    const parText = document.createElement('p');
    paragraph.appendChild(parText);
    parText.innerText = "Vaccinazioni: " + Vaccinated + "\n"  + "Vaccinazioni Parziali: " + partiallyVaccinated;
}
function onNewsClick(event){
    console.log("clicccato covid 19");
    const modale = document.querySelector('#modale');
    const title = document.createElement('h1');
    title.innerText = "SITUAZIONE COVID ITALIA";
    //devo prendere i dati dall'api_endpoint
    fetch(covid19_endpoint + "/cases?country=Italy").then(onResponse).then(onJsonCovid);
    
    modale.appendChild(title);
	//blocco lo scroll della pagina
	document.body.classList.add('no-scroll');
    //rendo la modale visibile
	modale.classList.remove('hidden');
    modale.addEventListener('click', chiudiModale);
}

function chiudiModale(event) {
	console.log("escape");
    const modale = document.querySelector('#modale');
	//aggiungo la classe hidden 
	modale.classList.add('hidden');
	//riabilito lo scroll
	document.body.classList.remove('no-scroll')
    modale.innerHTML = ' '; //pulisco
}
function onJsonShutter(json){
    console.log('JSON covid ricevuto');
    // Stampiamo il JSON per capire quali attributi ci servono
    console.log(json);
    const number = json.per_page;
    const modale = document.querySelector('#modale');
    const album = document.createElement('div');
    album.classList.add('album');

    for (let index = 0; index < number; index++) {
        const immagine = json.data[index].assets.large_thumb.url;
        const grid = document.createElement('div');
        const img = document.createElement('img');
        img.src = immagine;
        album.appendChild(grid);
        grid.appendChild(img);
    }
    modale.appendChild(album);
}


function onSearch(event){
    event.preventDefault();
    const modale = document.querySelector('#modale');
    const content = document.querySelector('#barra').value;
    console.log(content);
    const shutter_url = shutter_endpoint + content + '&per_page=' + 10 + '&aspect_ratio_min=' + 1;
    fetch(shutter_url,{
        headers:
        {
            'Authorization': 'Bearer ' + shutter_tocken
        }
    }).then(onResponse).then(onJsonShutter);


    //blocco lo scroll della pagina
	document.body.classList.add('no-scroll');
    //rendo la modale visibile
	modale.classList.remove('hidden');
    document.querySelector('#barra').value = '';
    modale.addEventListener('click', chiudiModale);
}
const news = document.querySelector("#covid");
news.addEventListener('click', onNewsClick);

const form = document.querySelector('#search_content');
form.addEventListener('submit', onSearch);
