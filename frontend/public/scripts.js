
const ul = document.querySelector("ul")
const input = document.querySelector("input")
const form = document.querySelector('form')

function load() {
    makeRequest('https://9da0bfffc7fa.ngrok.io/show')
        .then((data) => {
            for (let i in data.urls){
                addElement(data.urls[i].name, data.urls[i].content)
            }
        })
}


function addElement(name, url) {
    const li = document.createElement('li')
    const a = document.createElement("a")
    const trash = document.createElement("span")

    a.setAttribute('href', url)
    a.innerHTML = name
    a.target = "_blank"

    trash.innerHTML = "x"
    trash.onclick = () => removeElement(trash, a.href, name)

    li.append(a)
    li.append(trash)
    ul.append(li)
}

function removeElement(el, url, name) {
    if (confirm('Tem certeza que deseja deletar?')){
        let urlString = `https://9da0bfffc7fa.ngrok.io?name=${name}&content=${url}&del=1`
        makeRequest(urlString)
            .then((resp) => console.log(resp))
            .catch((err) => conssole.log(err))
        el.parentNode.remove()
    }
}

load()

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let { value } = input

    if (!value) 
        return alert('Preencha o campo')

    const [name, url] = value.split(",")

    if (!url) 
        return alert('formate o texto da maneira correta')

    if (!/^http/.test(url)) 
        return alert("Digite a url da maneira correta")

    let urlString = `https://9da0bfffc7fa.ngrok.io?name=${name}&content=${url}`
    makeRequest(urlString)
            .then((resp) => console.log(resp))
            .catch((err) => conssole.log(err))
    
    addElement(name, url)

    input.value = ""
})

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const resp = JSON.parse(xhr.responseText)
                resolve(resp)
            }
        })

        xhr.addEventListener('error', () => {
            reject("Ocorreu um erro")
        })

        xhr.send()
    })
}