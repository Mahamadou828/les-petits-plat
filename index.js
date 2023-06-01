//create variable that will hold the current applied filter
let ingredientsFilter = []
let utensilsFilter = []
let appliancesFilter = []

let currentRecipes = [...recipes]

let search = ""

function handleTag(val, key) {
    switch (key) {
        case "ingredients":
            ingredientsFilter = ingredientsFilter.filter((filter) => filter != val)
            break
        case "tools":
            appliancesFilter = appliancesFilter.filter((filter) => filter != val)
            break
        case "utensils":
            utensilsFilter = utensilsFilter.filter((filter) => filter != val)
            break
    }

    deleteTag(val)
    currentRecipes = findRecipe(recipes, search, ingredientsFilter, utensilsFilter, appliancesFilter)

    const newFilter = extractValues(currentRecipes)

    createFilters(newFilter.ingredients, newFilter.utensils, newFilter.appliances, handleFilter)

    displayRecipes(currentRecipes)
}

function handleFilter(val, key) {
    let status = "add"
    switch (key) {
        case "ingredients":
            if (ingredientsFilter.includes(val)) {
                ingredientsFilter = ingredientsFilter.filter((filter) => filter != val)
                status = "remove"
            }
            ingredientsFilter.push(val)
            break
        case "tools":
            if (appliancesFilter.includes(val)) {
                appliancesFilter = appliancesFilter.filter((filter) => filter != val)
                status = "remove"
            }
            appliancesFilter.push(val)
            break
        case "utensils":
            if (utensilsFilter.includes(val)) {
                utensilsFilter = utensilsFilter.filter((filter) => filter != val)
                status = "remove"
            }
            utensilsFilter.push(val)
            break
    }

    switch (status) {
        case "add":
            const tag = createTag(val, key, handleTag)
            document.querySelector("#tag-list").appendChild(tag)
            break
        case "remove":
            deleteTag(val)
            break
    }

    currentRecipes = findRecipe(currentRecipes, search, ingredientsFilter, utensilsFilter, appliancesFilter)
    console.log(currentRecipes)

    const newFilter = extractValues(currentRecipes)

    createFilters(newFilter.ingredients, newFilter.utensils, newFilter.appliances, handleFilter)

    displayRecipes(currentRecipes)
}

function findRecipe(recipes, principalSearch, ingredientTags, utensilTags, appareilTag) {
    const matchRecipe = [];

    if (principalSearch.length < 3) {
        return matchRecipe;
    }

    for (const recipe of recipes) {
        if (
            recipe.name.toLowerCase().includes(principalSearch.toLowerCase()) ||
            recipe.description.toLowerCase().includes(principalSearch.toLowerCase()) ||
            recipe.ingredients.some(
                (ingredient) =>
                    ingredient.ingredient.toLowerCase().includes(principalSearch.toLowerCase())
            )
        ) {
            matchRecipe.push(recipe);
        }
    }

    if (matchRecipe.length === 0) {
        console.log(`Aucune recette ne correspond à la recherche principale.`);
        return matchRecipe;
    }

    let filteredRecipe = [...matchRecipe];

    let mapIngredientRecipe = {}
    let mapUtensilsRecipe = {}
    let mapApplianceRecipe = {}

    if (ingredientTags.length > 0) {
        mapIngredientRecipe = filterByTag(filteredRecipe, 'ingredients', ingredientTags);
    }

    if (utensilTags.length > 0) {
        mapUtensilsRecipe = filterByTag(filteredRecipe, 'ustensils', utensilTags);
    }

    if (appareilTag.length > 0) {
        mapApplianceRecipe = filterByTag(filteredRecipe, 'appliance', appareilTag);
    }

    const res = []

    matchRecipe.forEach((recipe) => {
        let valid = true

        if (!mapIngredientRecipe[recipe.id] && ingredientTags.length > 0) {
            valid = false
        }

        if (!mapUtensilsRecipe[recipe.id] && utensilTags.length > 0) {
            valid = false
        }

        if (!mapApplianceRecipe[recipe.id] && appareilTag.length > 0) {
            valid = false
        }

        if(valid) {
            res.push(recipe)
        }
    })

    return res
}

function filterByTag(recipes, champ, tags) {
    const mapRecipe = {};
    switch (champ) {
        case "ustensils":
            for (const recette of recipes) {
                if (
                    recette[champ] &&
                    tags.every((tag) => recette[champ].map((item) => item.toLowerCase()).includes(tag.toLowerCase()))
                ) {
                    mapRecipe[recette.id] = true;
                }
            }
            break
        case "ingredients":
            for (const recette of recipes) {
                if (
                    recette[champ] &&
                    tags.every((tag) => recette[champ].map((ingredient) => ingredient.ingredient.toLowerCase()).includes(tag.toLowerCase()))
                ) {
                    mapRecipe[recette.id] = true;
                }
            }
            break
        case "appliance":
            for (const recette of recipes) {
                if (
                    recette[champ] &&
                    tags.every((tag) => {
                        console.log(recette[champ], tag.toLowerCase())
                        return recette[champ] === tag.toLowerCase()
                    })
                ) {
                    mapRecipe[recette.id] = true;
                }
            }
    }

    return mapRecipe
}


function displayRecipes(recipes) {
    const container = document.querySelector("#recipe-list")
    container.innerHTML = ""

    for (const recipe of recipes) {
        const elt = Recipe(recipe)
        container.appendChild(elt)
    }
}

async function init() {
    //display all recipe
    displayRecipes(currentRecipes)

    // create default filter
    const res = extractValues(currentRecipes)
    createFilters(res.ingredients, res.utensils, res.appliances, handleFilter)

    //handle filter opening
    const filters = ["ingredients", "tools", "utensils"]
    filters.forEach((filter) => {

        document.querySelector(`#${filter} > div.dropdown-header`).addEventListener("click", () => {
            const content = document.querySelector(`#${filter} > div.dropdown-content`)

            if (content.classList.contains("show")) {
                content.classList.remove("show")
            } else {
                content.classList.add("show")
            }

        })

    })



    //handle search with search input
    document.querySelector("#search").addEventListener("input", ({target: {value}}) => {
        if(value.length < 3) {
            return
        }
        search = value

        currentRecipes = findRecipe(recipes, search, ingredientsFilter, utensilsFilter, appliancesFilter)

        const newFilter = extractValues(currentRecipes)

        createFilters(newFilter.ingredients, newFilter.utensils, newFilter.appliances, handleFilter)

        displayRecipes(currentRecipes)
    })
}

init()
