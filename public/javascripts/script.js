const api_url = 'https://botw-compendium.herokuapp.com/api/v3/compendium/';
const compendium = document.getElementById('compendium');
const categorySelector = document.getElementById('categorySelector');
const locationSelector = document.getElementById('locationSelector');
const showAllCategoriesButton = document.getElementById('showAllCategories');
const showAllLocationsButton = document.getElementById('showAllLocations');
const toggleViewButton = document.getElementById('toggleView');
let isListView = false;

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

    // Add an event listener to the category selector for filtering
    categorySelector.addEventListener('change', () => {
        filterItems(items);
    });

    // Add an event listener to the location selector for filtering
    locationSelector.addEventListener('change', () => {
        filterItems(items);
    });

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
    items.forEach(item => {
        const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;

        // Check location filter (only if location is not "Show All")
        let locationMatch = false;
        if (selectedLocation === 'all') {
            locationMatch = true;
        } else if (Array.isArray(item.common_locations)) {
            // If item has multiple locations, check if any match
            locationMatch = item.common_locations.includes(selectedLocation);
        } else {
            locationMatch = item.common_locations === selectedLocation;
        }

        // Show item if both category and location match
        if (categoryMatch && locationMatch) {
            showAllItems(item);
        }
    });
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