function extractValues(recipes) {
    //extract all ingredient, tools, utensils and put them as choice
    const ingredients = [];
    const utensils = []
    const appliances = []

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.ingredient && !includes(ingredients, ingredient.ingredient)) {
                ingredients.push(ingredient.ingredient);
            }
        });

        recipe.ustensils.forEach(utensil => {
            if (utensil && !includes(utensils, utensil)) {
                utensils.push(utensil);
            }
        });

        if (recipe.appliance && !includes(appliances, recipe.appliance)) {
            appliances.push(recipe.appliance);
        }
    });

    return {ingredients, utensils, appliances}
}

function createFilters(ingredients, utensils, appliances, handleFilter) {
    createFilter(ingredients, "ingredients", handleFilter)
    createFilter(utensils, "utensils",  handleFilter)
    createFilter(appliances, "tools", handleFilter)
}

function createFilter(choices, tag, handleFilter) {
    const ul = document.querySelector(`#${tag} > div.dropdown-content > ul`)
    ul.innerHTML = ""

    choices.forEach((ingredient) => {
        const choice = document.createElement("li")
        choice.classList.add("choice")
        choice.innerText = ingredient

        choice.addEventListener("click", ({target: {outerText: val}}) => {
            handleFilter(val, tag)
        })

        ul.appendChild(choice)
    })
}
