function Recipe(recipe) {
    const container = document.createElement("div")
    container.classList.add("recipe")

    const recipeImg = document.createElement("img")
    recipeImg.setAttribute("src", `asset/recipe/${recipe.image}`)
    recipeImg.setAttribute("alt", recipe.name)

    const imgBlock = document.createElement("div")
    imgBlock.classList.add("recipe_img_block")

    const recipeContainer = document.createElement("div")
    recipeContainer.classList.add("recipe_container")

    const recipeTitle = document.createElement("h2")
    const recetteText = document.createElement("h3")
    recetteText.innerHTML = "Recette"

    const recipeDesc = document.createElement("p")
    recipeDesc.innerHTML = recipe.description

    const ingredientText = document.createElement("h4")
    ingredientText.innerHTML = "Ingrédients"

    const ingredientContainer = document.createElement("div")
    ingredientContainer.classList.add("ingredient_container")

    for(const ingredient of recipe.ingredients) {
        const ingredientItem = document.createElement("div")
        ingredientItem.classList.add("ingredient_item")

        ingredientItem.innerHTML = `<p>${ingredient.ingredient}</p> <br/> <span>${ingredient.quantity ? ingredient.quantity : "" } ${ingredient.unit ? ingredient.unit : "" }</span>`

        ingredientContainer.appendChild(ingredientItem)
    }

    recipeContainer.appendChild(recipeTitle)
    recipeContainer.appendChild(recetteText)
    recipeContainer.appendChild(recipeDesc)
    recipeContainer.appendChild(ingredientText)
    recipeContainer.appendChild(ingredientContainer)

    container.appendChild(recipeImg)
    container.appendChild(imgBlock)
    container.appendChild(recipeContainer)

    return container
}
