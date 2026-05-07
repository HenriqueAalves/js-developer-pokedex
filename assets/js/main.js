const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
let pokemonStorage = []

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}"onclick="showPokemonDetail(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {

        pokemonStorage = pokemonStorage.concat(pokemons)
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function showPokemonDetail(number) {
    const pokemon = pokemonStorage.find((pokemon) => pokemon.number === number)
    console.log(pokemon)

    if (!pokemon) return

    const modal = document
        .getElementById('pokemonDetail')
    const modalContent = document
        .querySelector('.modal-content')
    let closeButton = document.getElementById('closeModal')
    if (!closeButton) {
        closeButton = document.createElement('button')
        closeButton.id = 'closeModal'
        closeButton.innerText = 'X'

        modalContent.appendChild(closeButton)
    }

    const heightInMeters = pokemon.height / 10
    const weightInKg = pokemon.weight / 10

            document.getElementById('detailExtra').innerHTML = `
        <div class="extra-info">
        <div class-"info-box">
        <strong>Altura</strong><span> ${heightInMeters.toFixed(1)} m</span>
        </div> 
        <div class="info-box"><strong>Peso</strong><span> ${weightInKg.toFixed(1)} kg</span>
        </div>
        <div class="info-box">
            <strong>Habilidades</strong <span> ${pokemon.abilities.join(', ')}
        </span>
        </div>
    </div>
        `


    closeButton.onclick = closePokemonDetail

    modalContent.className = `modal-content ${pokemon.type}`
    

    document.getElementById('detailName').innerText = pokemon.name
    document.getElementById('detailNumber').innerText = `#${pokemon.number}`
    document.getElementById('detailTypes').innerHTML = pokemon.types.map((type) => `<span class="modal-type ${type}">${type}</span>`).join('')
    document.getElementById('detailImage').src = pokemon.photo
    document.getElementById('detailImage').alt = pokemon.name

    modalContent.classList.remove('open')
    void modalContent.offsetWidth
    modal.classList.remove('hidden')
    modalContent.classList.add('open')

}

function closePokemonDetail() {
    const modal = document
    .getElementById('pokemonDetail')
    const modalContent = document
    .querySelector('.modal-content')

    modalContent.classList.remove('open')
    modalContent.classList.add('close')
    setTimeout(() => {
        modal.classList.add('hidden')
        modalContent.classList.remove('close')
    }, 200)
}