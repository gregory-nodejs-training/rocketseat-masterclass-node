const ul = document.querySelector("ul")
const input = document.querySelector("input")
const form = document.querySelector('form')


async function load() {
    const res = await fetch("http://localhost:3000").then((data) => data.json());
    res.urls.map(({ name, url }) => addElement({ name, url }));
}

load()

function addElement({ name, url }) {
    const li = document.createElement('li')
    const a = document.createElement("a")
    const trash = document.createElement("span")

    a.href = url
    a.innerHTML = name
    a.target = "_blank"

    trash.innerHTML = "x"
    trash.onclick = () => removeElement(trash, name, url)

    li.append(a)
    li.append(trash)
    ul.append(li)
}

function removeElement(el, name, url) {
    if (confirm('Tem certeza que deseja deletar?')) {
        deleteElement(el, name, url);
    }
}

async function deleteElement(el, name, url) {
    const requestUrl = `http://localhost:3000/?name=${name}&url=${url}&del=1`;
    fetch(requestUrl).then(() => {
        el.parentNode.remove();
    }).catch(err => console.log(err));
}

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

    saveElement(name, url);

    input.value = ""
})

async function saveElement(name, url) {
    const requestUrl = `http://localhost:3000/?name=${name}&url=${url}`;
    fetch(requestUrl).then(() => {
        addElement({ name, url });
    }).catch(err => console.log(err));
}