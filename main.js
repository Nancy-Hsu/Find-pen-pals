const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const Index_URL = BASE_URL + '/api/v1/users/'
const users = []
const dataPanel = document.querySelector('#data-panel')
const userPanel = document.querySelector('#user-panel')
const USERS_PER_PAGE = 20
const paginator = document.querySelector('.pagination')
const modal = document.querySelector('#user-modal')
const modalColseBtn = document.querySelector('#btn-modal-close')

function renderUserList(users) {
  let contentHTML = ``
  users.forEach(user => {
    contentHTML += `
     <div  class="card shadow-sm  m-4 py-2" id='personal-card' style="width: 15rem;">
    <img class="p-3 pb-0" src="${user.avatar}" alt="users picture">
    <div class="card-body pb-0">
      <h5 class="card-title p-2 text-center">${user.name + user.surname}</h5>
      <div class="card-body border-top p-2 d-flex">
<p class="card-text mb-0 text-center w-25">${user.region}</p>
<p class="card-text mb-0 text-center w-75">${user.birthday}</p>
</div>
      <div class="card-footer d-flex justify-content-end p-3 ">
        <button type="button" class="more-btn-modal btn btn-secondary fs-8 lh-sm " data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}">
          More 
        </button>
      </div>
    </div>
  </div>
</div>`
  })
  userPanel.innerHTML = contentHTML
}

axios.get(Index_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUserList(getUserByPage(1, users))
})

dataPanel.addEventListener('click', toggleModal)

function toggleModal(e) {
  const target = e.target
  if (target.classList.contains('more-btn-modal')) {
    showUserModal(Number(target.dataset.id))
  } else if (target.matches('.country-catalog')) {
    searchByCountry(target.dataset.country)
  } else if (target.matches('#see-all')) {
    renderPaginator(users.length)
    renderUserList(getUserByPage(1, users))
  }
}

////修改modal
function showUserModal(id) {
  const modalName = document.querySelector('#user-modal-name')
  const modalImage = document.querySelector('#user-modal-image')
  const modalAge = document.querySelector('#user-modal-age')
  const modalGender = document.querySelector('#user-modal-gender')
  const modalRegion = document.querySelector('#user-modal-region')
  const modalBirthday = document.querySelector('#user-modal-birthday')
  const modalEmail = document.querySelector('#user-modal-email')
  const addWriteBtn = document.querySelector('#btn-add-write')

  axios.get(Index_URL + id).then(response => {

    const data = response.data
    modalName.textContent = `${data.name} ${data.surname}`
    modalImage.innerHTML = `<img id="user-modal-img" class=" m-3 px-0 w-75 h-75 rounded-circle border m-auto border-3" src="${data.avatar}" class=" " alt="users picture">`
    modalAge.textContent = data.age
    modalGender.textContent = data.gender
    modalRegion.textContent = data.region
    modalBirthday.textContent = data.birthday
    modalEmail.innerHTML = `<a href="${data.email}">${data.email}</a>`
    addWriteBtn.dataset.id = data.id
  })
  modalColseBtn.addEventListener('click', function clearInfo() {

    modalName.textContent = ``
    modalImage.innerHTML = ``
    modalAge.textContent = ``
    modalGender.textContent = ``
    modalRegion.textContent = ``
    modalBirthday.textContent = ``
    modalEmail.innerHTML = ``
  })
}

//search name & surname
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

searchForm.addEventListener('input', function searchByInput(e) {
  e.preventDefault()
  const userInput = searchInput.value.trim().toLowerCase()
  const filteredUsers = users.filter(user => { return user.name.toLowerCase().includes(userInput) || user.surname.toLowerCase().includes(userInput) })

  if (!filteredUsers.length) {
    userPanel.innerHTML = `<p class='mt-5'>sorry....there is no result regarding your input</div>`
    return;
  }

  renderPaginator(filteredUsers.length)
  renderUserList(getUserByPage(1, filteredUsers))
})



const userModal = document.querySelector('#user-modal')
userModal.addEventListener('click', function clickOnModal(e) {
  const target = e.target
  if (target.matches('#btn-add-write')) {
    const id = Number(target.dataset.id)
    addToWriteAway(id)
  }

})

function addToWriteAway(id) {
  const writeList = JSON.parse(localStorage.getItem('collectPerson')) || []
  const person = users.find(user => user.id === id)

  if (writeList.some(item => item.id === id)) {
    return alert('This person is already in your Write Away')
  }
  writeList.push(person)
  localStorage.setItem('collectPerson', JSON.stringify(writeList))
  alert('Added to Write Away')
}



//////country
const countries = [
  {
    name: 'GB',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_the_United_Kingdom_%282-3%29.svg/1200px-Flag_of_the_United_Kingdom_%282-3%29.svg.png'
  },
  {
    name: 'AU',
    flag: 'https://image.shutterstock.com/image-vector/flag-australia-union-jack-stars-260nw-789566164.jpghttps://image.shutterstock.com/image-vector/flag-australia-union-jack-stars-260nw-789566164.jpg'
  },
  {
    name: 'DE',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png'
  },
  {
    name: 'US',
    flag: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png'
  },
  {
    name: 'CH',
    flag: 'https://flagpedia.net/data/flags/w1600/ch.png'
  },
  {
    name: 'NO',
    flag: 'https://flagpedia.net/data/flags/w580/no.png'
  },
  {
    name: 'TR',
    flag: 'https://stechome.com.tr/Content/trflag.png'
  },
]

const countryData = document.querySelector('#select-country')

function renderCountryData(data) {
  let rawHTML = ``
  data.forEach(item => {
    rawHTML += `<div class="mx-4 ">
        <img class="country-catalog " src="${item.flag}" alt="country" data-country='${item.name}'>
        <p class="country-name mb-0 fs-4 fw-bold">${item.name}</p>
      </div>`
  })
  countryData.innerHTML = rawHTML
}

renderCountryData(countries)


function searchByCountry(item) {
  const filteredCountry = users.filter(user => user.region === item)
  renderPaginator(filteredCountry.length)
  renderUserList(getUserByPage(1, filteredCountry))

}


function getUserByPage(page, data) {
  const startPage = (page - 1) * USERS_PER_PAGE
  const endPage = page * USERS_PER_PAGE
  return data.slice(startPage, endPage)
}

function renderPaginator(amount) {
  const numOfPage = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#data-panel" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


paginator.addEventListener('click', function clickedPaginator(e) {
  const target = e.target
  if (target.tagName !== 'A') return
  const page = Number(target.dataset.page)
  renderUserList(getUserByPage(page, users))
})