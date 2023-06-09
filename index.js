//create variable that will hold the current applied filter
let ingredientsFilter = []
let utensilsFilter = []
let appliancesFilter = []

let currentRecipes = [...recipes]

let search = ""

function debounce(fn, delay) {
    let timer;
    return (() => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(), delay);
    })();
}

function handleTag(val, key) {
    switch (key) {
        case "ingredients":
            ingredientsFilter = filter(ingredientsFilter, (filter) => filter != val)
            break
        case "tools":
            appliancesFilter = filter(appliancesFilter,(filter) => filter != val)
            break
        case "utensils":
            utensilsFilter = filter(utensilsFilter,(filter) => filter != val)
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
            if (includes(ingredientsFilter, val)) {
                ingredientsFilter = filter(ingredientsFilter,(filter) => filter != val)
                status = "remove"
            }
            ingredientsFilter.push(val)
            break
        case "tools":
            if (includes(appliancesFilter, val)) {
                appliancesFilter = filter(appliancesFilter,(filter) => filter != val)
                status = "remove"
            }
            appliancesFilter.push(val)
            break
        case "utensils":
            if (includes(utensilsFilter, val)) {
                utensilsFilter = filter(utensilsFilter, (filter) => filter != val)
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

    const newFilter = extractValues(currentRecipes)

    createFilters(newFilter.ingredients, newFilter.utensils, newFilter.appliances, handleFilter)

    displayRecipes(currentRecipes)
}

function findRecipe(recipes, principalSearch, ingredientTags, utensilTags, appareilTag) {
    let matchRecipe = [];

    if(principalSearch.length > 0) {
        for(let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i]
            const lowerCasePrincipalSearch = principalSearch.toLowerCase();

            if(
                recipe.name.toLowerCase().indexOf(lowerCasePrincipalSearch) !== -1 ||
                recipe.name.toLocaleString().indexOf(lowerCasePrincipalSearch) !== -1
            ) {
                const ingredients = recipe.ingredients

                for(let j = 0; j < ingredients.length; j++) {
                    const ingredient = ingredients[j]
                    if(ingredient.ingredient.toLowerCase().indexOf(lowerCasePrincipalSearch) !== -1) {
                        matchRecipe.push(recipe)
                        break
                    }
                }
            }
        }
    } else {
        matchRecipe = recipes
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

    for(let i = 0; i < matchRecipe.length; i++) {
        const recipe = matchRecipe[i]
        let valid = true

        if(!mapIngredientRecipe[recipe.id] && ingredientTags.length > 0) {
            valid = false
        }

        if(!mapUtensilsRecipe[recipe.id] && utensilTags.length > 0) {
            valid = false
        }

        if(!mapApplianceRecipe[recipe.id] && appareilTag.length > 0) {
            valid = false
        }

        if(valid) {
            res.push(recipe)
        }
    }

    return res
}

function filterByTag(recipes, champ, tags) {
    const mapRecipe = {};
    switch (champ) {
        case "ustensils":
            for (let i = 0; i < recipes.length; i++) {
                const recette = recipes[i];
                if (
                    recette[champ] &&
                    tags.every((tag) => recette[champ].map((item) => item.toLowerCase()).includes(tag.toLowerCase()))
                ) {
                    mapRecipe[recette.id] = true;
                }
            }
            break
        case "ingredients":
            for (let i = 0; i < recipes.length; i++) {
                const recette = recipes[i];
                if (
                    recette[champ] &&
                    tags.every((tag) => recette[champ].map((ingredient) => ingredient.ingredient.toLowerCase()).includes(tag.toLowerCase()))
                ) {
                    mapRecipe[recette.id] = true;
                }
            }
            break
        case "appliance":
            for (let i = 0; i < recipes.length; i++) {
                const recette = recipes[i];
                if (
                    recette[champ] &&
                    tags.every((tag) => {
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
        debounce(() => {
            if(value.length < 3) {
                return
            }
            search = value

            currentRecipes = findRecipe(recipes, search, ingredientsFilter, utensilsFilter, appliancesFilter)

            const newFilter = extractValues(currentRecipes)

            createFilters(newFilter.ingredients, newFilter.utensils, newFilter.appliances, handleFilter)

            displayRecipes(currentRecipes)
        }, 300)
    })
}

init()
