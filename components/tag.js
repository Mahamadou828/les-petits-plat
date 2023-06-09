function createTag(val, key, handleClose) {
    const tag = document.createElement("div")
    tag.classList.add("tag")
    tag.setAttribute("id", val.toLowerCase().replaceAll(" ", "_"))

    const p = document.createElement("p")
    p.innerText = val

    const button = document.createElement("button")
    button.addEventListener("click", () => {
        handleClose(val, key)
    })

    const img = document.createElement("img")
    img.setAttribute("src", "asset/close.svg")
    img.setAttribute("alt", "close button")

    button.appendChild(img)

    tag.appendChild(p)
    tag.appendChild(button)

    return tag
}

function deleteTag(val) {
    document.getElementById(val.toLowerCase().replaceAll(" ", "_")).remove()
}
