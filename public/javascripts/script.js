const api_url = 'https://botw-compendium.herokuapp.com/api/v3/compendium/';
const compendium = document.getElementById('compendium');
const categorySelector = document.getElementById('categorySelector');
const locationSelector = document.getElementById('locationSelector');
const monsterSelector = document.getElementById('monsterSelector');
const showAllCategoriesButton = document.getElementById('showAllCategories');
const showAllLocationsButton = document.getElementById('showAllLocations');
const toggleViewButton = document.getElementById('toggleView');
const sortAlphabeticallyButton = document.getElementById('sortAlphabetically');

let isListView = false;
let isSortedAlphabetically = false;

// get all items from the API
async function getAllItems() {
    const response = await fetch(api_url + 'all');
    const data = await response.json();
    const items = data.data;
    toggleViewButton.innerText = isListView ? 'Switch to Card View' : 'Switch to List View';
    return items;
}

getAllItems().then((items) => {
    // Show all items initially
    items.forEach(item => {
        showAllItems(item);
    });

    // Event listeners for filters and sorting
    categorySelector.addEventListener('change', () => filterItems(items));
    locationSelector.addEventListener('change', () => filterItems(items));
    monsterSelector.addEventListener('change', () => monsterFilter(items));
    showAllCategoriesButton.addEventListener('click', () => {
        categorySelector.value = 'all';
        filterItems(items);
    });
    showAllLocationsButton.addEventListener('click', () => {
        locationSelector.value = 'all';
        filterItems(items);
    });
    toggleViewButton.addEventListener('click', () => {
        isListView = !isListView;
        toggleViewButton.innerText = isListView ? 'Switch to Card View' : 'Switch to List View';
        filterItems(items);
    });
    
    sortAlphabeticallyButton.addEventListener('click', () => {
        isSortedAlphabetically = !isSortedAlphabetically;
        sortAlphabeticallyButton.innerText = isSortedAlphabetically ? 'Sort Normally' : 'Sort Alphabetically';
        filterItems(items);
    });
});


function showAllItems(item) {
    const element = document.createElement('div');
    compendium.appendChild(element);
    element.classList.add(isListView ? 'list-item' : 'box');
    switch (item.category) {
        case 'monsters':
            item = new Monster(element, item.name, item.image, item.category, item.description, item.common_locations, item.dlc, item.drops);
            item.showMonster();
            break;
        case 'equipment':
            item = new Equipment(element, item.name, item.image, item.category, item.description, item.common_locations, item.dlc, item.properties.attack, item.properties.defense);
            item.showEquipment();
            break;
        case 'materials':
            item = new Material(element, item.name, item.image, item.category, item.description, item.common_locations, item.dlc, item.hearts_recovered, item.cooking_effect);
            item.showMaterial();
            break;
        case 'creatures':
            item = new Creature(element, item.name, item.image, item.category, item.description, item.common_locations, item.dlc, item.drops, item.cooking_effect, item.edible, item.hearts_recovered);
            item.showCreature();
            break;
        case 'treasure':
            item = new Treasure(element, item.name, item.image, item.category, item.description, item.common_locations, item.dlc, item.drops);
            item.showTreasure();
            break;
        default:
            break;
    }
}

// Filter items based on selected category
function filterItems(items) {
    const selectedCategory = categorySelector.value;
    const selectedLocation = locationSelector.value;

    // Clear current items
    compendium.innerHTML = '';


    // Filter items based on selected category and location
    let filteredItems = items.filter(item => {
        const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
        const locationMatch = selectedLocation === 'all' || (Array.isArray(item.common_locations) ? item.common_locations.includes(selectedLocation) : item.common_locations === selectedLocation);
        return categoryMatch && locationMatch;
    });

    // Sort items alphabetically if sorting is enabled
    if (isSortedAlphabetically) {
        filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Show filtered (and sorted) items
    filteredItems.forEach(showAllItems);
}

function monsterFilter(items) {
    compendium.innerHTML = '';
    const selectedMonster = monsterSelector.value;
    items.forEach(item => {
        switch (selectedMonster) {
            case 'common':
                if ((item.name.includes('chuchu') || item.name.includes('keese') || item.name.includes('octorok') || item.name.includes('robe') ||
                    item.name.includes('pebblit') || item.name.includes('blin') || item.name.includes('liza') || item.name.includes('yiga')) && item.category == 'monsters') {
                    showAllItems(item);
                }
                break;
            case 'guardian':
                if (item.category == 'monsters' && (item.name.includes('guardian'))) {
                    showAllItems(item);
                }
                break;
            case 'sub':
                if (item.category == 'monsters' && (item.name.includes('talus') || item.name.includes('nox') ||
                    item.name.includes('mold') || item.name.includes('lynel'))) {
                    showAllItems(item);
                }
                break;
            case 'boss':
                if (item.category == 'monsters' && (item.name.includes('kohga') || item.name.includes('monk') || item.name.includes('ganon'))) {
                    showAllItems(item);
                }
                break;
            case 'all':
                if (item.category == 'monsters') {
                    showAllItems(item);
                }
                break;
            default:
                break;
        }
    })
}

//base class for all items
class Item {
    constructor(element, name, image, category, description, location, dlc) {
        this.element = element;
        this.name = name;
        this.image = image;
        this.category = category;
        this.description = description;
        this.location = location;
        this.dlc = dlc;

        this.element.classList.add(this.category, 'box');
    }
}

//individual class for each category
class Monster extends Item {
    constructor(element, name, image, category, description, location, dlc, drops) {
        super(element, name, image, category, description, location, dlc);
        this.drops = drops;
    }

    showMonster() {
        this.element.innerHTML = '';

        const nameElement = document.createElement('h3');
        nameElement.classList.add('title_case');
        nameElement.innerText = this.name;

        const imageElement = document.createElement('img');
        imageElement.classList.add('image');
        imageElement.src = this.image;

        const categoryElement = document.createElement('p');
        categoryElement.classList.add('title_case');
        categoryElement.innerText = 'Type: ' + this.category;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.innerText = this.description;

        const locationElement = document.createElement('p');
        locationElement.classList.add('location');
        locationElement.innerText = 'Common Locations: ' + this.location;

        const dropsElement = document.createElement('p');
        dropsElement.classList.add('drops');
        dropsElement.innerText = 'Drops: ' + this.drops;

        const dlcElement = document.createElement('p');
        dlcElement.classList.add('dlc');
        dlcElement.innerText = 'Is in DLC?: ' + this.dlc;

        this.element.appendChild(nameElement);
        this.element.appendChild(imageElement);
        this.element.appendChild(categoryElement);
        this.element.appendChild(descriptionElement);
        this.element.appendChild(locationElement);
        this.element.appendChild(dropsElement);
        this.element.appendChild(dlcElement);
    }
}

class Equipment extends Item {
    constructor(element, name, image, category, description, location, dlc, attack, defense) {
        super(element, name, image, category, description, location, dlc);
        this.attack = attack;
        this.defense = defense;
    }

    showEquipment() {
        this.element.innerHTML = '';

        const nameElement = document.createElement('h3');
        nameElement.classList.add('name', 'title_case');
        nameElement.innerText = this.name;

        const imageElement = document.createElement('img');
        imageElement.classList.add('image');
        imageElement.src = this.image;

        const categoryElement = document.createElement('p');
        categoryElement.classList.add('category', 'title_case');
        categoryElement.innerText = 'Type: ' + this.category;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.innerText = this.description;

        const locationElement = document.createElement('p');
        locationElement.classList.add('location');
        locationElement.innerText = 'Common Locations: ' + this.location;

        const attackElement = document.createElement('p');
        attackElement.classList.add('attack');
        attackElement.innerText = 'Attack Power: ' + this.attack;

        const defenseElement = document.createElement('p');
        defenseElement.classList.add('defense');
        defenseElement.innerText = 'Defense: ' + this.defense;

        const dlcElement = document.createElement('p');
        dlcElement.classList.add('dlc');
        dlcElement.innerText = 'Is in DLC?: ' + this.dlc;

        this.element.appendChild(nameElement);
        this.element.appendChild(imageElement);
        this.element.appendChild(categoryElement);
        this.element.appendChild(descriptionElement);
        this.element.appendChild(locationElement);
        if (this.attack != 0) {
            this.element.appendChild(attackElement);
        }
        if (this.defense != 0) {
            this.element.appendChild(defenseElement);
        }
        this.element.appendChild(dlcElement);
    }
}

class Material extends Item {
    constructor(element, name, image, category, description, location, dlc, hearts, cooking) {
        super(element, name, image, category, description, location, dlc);
        this.hearts = hearts;
        this.cooking = cooking;
    }

    showMaterial() {
        this.element.innerHTML = '';

        const nameElement = document.createElement('h3');
        nameElement.classList.add('name', 'title_case');
        nameElement.innerText = this.name;

        const imageElement = document.createElement('img');
        imageElement.classList.add('image');
        imageElement.src = this.image;

        const categoryElement = document.createElement('p');
        categoryElement.classList.add('category', 'title_case');
        categoryElement.innerText = 'Type: ' + this.category;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.innerText = this.description;

        const locationElement = document.createElement('p');
        locationElement.classList.add('location');
        locationElement.innerText = 'Common Locations: ' + this.location;

        const dlcElement = document.createElement('p');
        dlcElement.classList.add('dlc');
        dlcElement.innerText = 'Is in DLC?: ' + this.dlc;

        const heartsElement = document.createElement('p');
        heartsElement.classList.add('hearts');
        heartsElement.innerText = 'Hearts Recovered: ' + this.hearts;

        const cookingElement = document.createElement('p');
        cookingElement.classList.add('cooking', 'title_case');
        cookingElement.innerText = 'Cooking Effect: ' + this.cooking;

        this.element.appendChild(nameElement);
        this.element.appendChild(imageElement);
        this.element.appendChild(categoryElement);
        this.element.appendChild(descriptionElement);
        this.element.appendChild(locationElement);
        this.element.appendChild(heartsElement);
        this.element.appendChild(cookingElement);
        this.element.appendChild(dlcElement);
    }
}

class Creature extends Item {
    constructor(element, name, image, category, description, location, dlc, drops, cooking, edible, hearts) {
        super(element, name, image, category, description, location, dlc)
        this.drops = drops;
        this.cooking = cooking;
        this.edible = edible;
        this.hearts = hearts;
    }

    showCreature() {
        this.element.innerHTML = '';

        const nameElement = document.createElement('h3');
        nameElement.classList.add('name', 'title_case');
        nameElement.innerText = this.name;

        const imageElement = document.createElement('img');
        imageElement.classList.add('image');
        imageElement.src = this.image;

        const categoryElement = document.createElement('p');
        categoryElement.classList.add('category', 'title_case');
        categoryElement.innerText = 'Type: ' + this.category;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.innerText = this.description;

        const locationElement = document.createElement('p');
        locationElement.classList.add('location');
        locationElement.innerText = 'Common Locations: ' + this.location;

        const dlcElement = document.createElement('p');
        dlcElement.classList.add('dlc');
        dlcElement.innerText = 'Is in DLC?: ' + this.dlc;

        const dropsElement = document.createElement('p');
        dropsElement.classList.add('drops');
        dropsElement.innerText = 'Drops: ' + this.drops;

        const edibleElement = document.createElement('p');
        edibleElement.classList.add('edible');
        edibleElement.innerText = 'Is this edible?: ' + this.edible;

        const heartsElement = document.createElement('p');
        heartsElement.classList.add('hearts');
        heartsElement.innerText = 'Hearts Recovered: ' + this.hearts;

        const cookingElement = document.createElement('p');
        cookingElement.classList.add('cooking', 'title_case');
        cookingElement.innerText = 'Cooking Effect: ' + this.cooking;

        this.element.appendChild(nameElement);
        this.element.appendChild(imageElement);
        this.element.appendChild(categoryElement);
        this.element.appendChild(descriptionElement);
        this.element.appendChild(locationElement);
        this.element.appendChild(dropsElement);
        this.element.appendChild(edibleElement);
        this.element.appendChild(heartsElement);
        this.element.appendChild(cookingElement);
        this.element.appendChild(dlcElement);
    }
}

class Treasure extends Item {
    constructor(element, name, image, category, description, location, dlc, drops) {
        super(element, name, image, category, description, location, dlc);
        this.drops = drops;
    }

    showTreasure() {
        this.element.innerHTML = '';

        const nameElement = document.createElement('h3');
        nameElement.classList.add('title_case');
        nameElement.innerText = this.name;

        const imageElement = document.createElement('img');
        imageElement.classList.add('image');
        imageElement.src = this.image;

        const categoryElement = document.createElement('p');
        categoryElement.classList.add('title_case');
        categoryElement.innerText = 'Type: ' + this.category;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.innerText = this.description;

        const locationElement = document.createElement('p');
        locationElement.classList.add('location');
        locationElement.innerText = 'Common Locations: ' + this.location;

        const dropsElement = document.createElement('p');
        dropsElement.classList.add('drops');
        dropsElement.innerText = 'Drops: ' + this.drops;

        const dlcElement = document.createElement('p');
        dlcElement.classList.add('dlc');
        dlcElement.innerText = 'Is in DLC?: ' + this.dlc;

        this.element.appendChild(nameElement);
        this.element.appendChild(imageElement);
        this.element.appendChild(categoryElement);
        this.element.appendChild(descriptionElement);
        this.element.appendChild(locationElement);
        this.element.appendChild(dropsElement);
        this.element.appendChild(dlcElement);
    }
}