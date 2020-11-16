const country = document.getElementById('countries')
const form = document.getElementById('form')
const buscar = document.getElementById('buscar')
const region = document.getElementById('region')
const darkMode = document.getElementById('dark')
const iconoDark = document.getElementById('lunaDark')
const title = document.getElementById('title')
const iconbuscar = document.getElementById('buscarIcon')
//ventana modal
const modal = document.getElementById('modal')
const modalContent = document.getElementById('modalContent')
const imgModal = document.getElementById('imgModal')
const tituloModal = document.getElementById('tituloModal')
const poblacionModal = document.getElementById('poblaModal')
const capitalModal = document.getElementById('capitalModal')
const regionModal = document.getElementById('regionModal')
const monedaModal = document.getElementById('monedaModal')
const borderModal = document.getElementById('borderModal')
//section
const sectionCountry = document.getElementsByTagName('section')
//grafico
const botonGrafico = document.getElementById('grafico')
const modal2 = document.getElementById('modal2')
const moodalContent2 = document.getElementById('modal__content2')
const canvas = document.getElementById('mychart')

const getCountries = async (userUrl = '') => {
    const url = userUrl || 'https://restcountries.eu/rest/v2/all'
    await fetch(url)
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => {
            const fragment = document.createDocumentFragment()
            for (const paises of res) {
                const section = document.createElement('section')
                section.classList.add('country')
                const img = document.createElement('img')
                img.src = paises.flag
                const title = document.createElement('h2')
                title.textContent = `Nombre: ${paises.name}`
                const population = document.createElement('p')
                population.textContent = `Población ${paises.population}`
                const capital = document.createElement('p')
                capital.textContent = `Capital: ${paises.capital}`
                const region = document.createElement('p')
                region.textContent = `Región: ${paises.region}`
                const moneda = document.createElement('p')
                moneda.textContent = `Moneda: $${paises.currencies[0].name}`
                const fronteras = document.createElement('p')
                fronteras.classList.add('noMostrar')
                fronteras.textContent = `${paises.borders}`
                section.appendChild(img)
                section.appendChild(title)
                section.appendChild(population)
                section.appendChild(capital)
                section.appendChild(region)
                section.appendChild(moneda)
                section.appendChild(fronteras)
                fragment.appendChild(section)
            }
            country.innerHTML = ''
            country.appendChild(fragment)
        })
    const secciones = document.querySelectorAll('section')
    for (const paises of secciones) {
        paises.addEventListener('click', () => {
            modal.classList.add('modal--show')
            imgModal.src = `${paises.childNodes[0].src}`
            tituloModal.textContent = paises.childNodes[1].textContent
            poblacionModal.textContent = paises.childNodes[2].textContent
            capitalModal.textContent = paises.childNodes[3].textContent
            regionModal.textContent = paises.childNodes[4].textContent
            monedaModal.textContent = paises.childNodes[5].textContent
            if (paises.childNodes[6].textContent === '') {
                borderModal.textContent = 'Datos de fronteras no disponibles'
            } else {
                borderModal.textContent = 'Fronteras: ' + paises.childNodes[6].textContent
            }

        })
    }
}

modal.addEventListener('click', () => {
    modal.classList.remove('modal--show')

})
botonGrafico.addEventListener('click', (e) => {
    modal2.classList.add('modal--show2')
})
modal2.addEventListener('click', () => {
    modal2.classList.remove('modal--show2')
})
const mostrarGrafico = async () => {
    let dataAfrica
    let dataAmerica
    let dataAsia
    let dataEurope
    let dataOceania
    try {
        const r1 = await axios('https://restcountries.eu/rest/v2/region/Africa')
        let data1 = r1.data
        dataAfrica = data1.length

        const r2 = await axios('https://restcountries.eu/rest/v2/region/Americas')
        let data2 = r2.data
        dataAmerica = data2.length

        const r3 = await axios('https://restcountries.eu/rest/v2/region/Asia')
        let data3 = r3.data
        dataAsia = data3.length

        const r4 = await axios('https://restcountries.eu/rest/v2/region/europe')
        let data4 = r4.data
        dataEurope = data4.length

        const r5 = await axios('https://restcountries.eu/rest/v2/region/Americas')
        let data5 = r5.data
        dataOceania = data5.length

    } catch (error) {
        console.log(error)
    }
    var ctx = document.getElementById('mychart').getContext('2d');
    var myChart = new Chart(ctx, {

        type: 'bar',
        data: {
            datasets: [{
                label: 'Países',
                data: [dataAfrica, dataAmerica, dataAsia, dataEurope, dataOceania],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,

            }]
        },
        options: {
            layout: {

            },
            responsive: true,
            title: {
                display: true,
                text: 'N° Países por región',
                fontSize: 20,
                fontColor: '#fff',
                position: 'top'
            },
            scales: {
                xAxes: [{
                    labels: ['África', 'Ámerica', 'Asia', 'Europa', 'Oceanía'],
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMin: 50,
                        suggestedMax: 50,
                        stepSize: 5,
                    }
                }]
            }
        }
    });
}

const readUserChange = (data, ev) => {
    if (data.length >= 3 && ev === 'input') {
        getCountries(`https://restcountries.eu/rest/v2/name/${data}`)
    } else if (ev === 'select') {
        getCountries(`https://restcountries.eu/rest/v2/region/${data}`)
    }
}

form.addEventListener('change', e => {
    if (e.target.value != 'default') {
        readUserChange(e.target.value, 'select')
    } else {
        getCountries()
    }

})
form.addEventListener('keyup', e => {
    if (buscar.value != '') {
        readUserChange(buscar.value, 'input')
    } else {
        getCountries()
    }
})

darkMode.addEventListener('click', () => {
    //al cambiar de región se invierten los estilos, falta resolver
    //FALTA
    // for (const countries of sectionCountry) {
    //     if(countries.classList.contains('country') && !countries.classList.contains('darkCountry')){
    //         countries.classList.add('darkCountry')
    //     }else if(countries.classList.contains('country') && countries.classList.contains('darkCountry')){
    //         countries.classList.remove('darkCountry')
    //     }
    // }
    darkMode.dataset.boton = 'activado'
    document.body.classList.toggle('darkMode')
    title.classList.toggle('darktitle')
    darkMode.classList.toggle('darkboton')
    modalContent.classList.toggle('modal__dark')
    if (darkMode.classList.contains('darkboton')) {
        darkMode.dataset.boton = 'activado'
    } else {
        darkMode.dataset.boton = 'desactivado'
    }
    iconbuscar.classList.toggle('buscarDark')
    if (iconoDark.className === 'far fa-sun') {
        iconoDark.className = 'far fa-moon'
        iconoDark.classList.toggle('farDark')
    } else {
        iconoDark.className = 'far fa-sun'
    }
})


document.addEventListener('DOMContentLoaded', () => {
    getCountries()
})
mostrarGrafico()
