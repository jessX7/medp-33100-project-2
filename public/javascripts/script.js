const api_url = 'https://botw-compendium.herokuapp.com/api/v3/compendium/';
const compendium = document.getElementById('compendium');

// get all items from the API
async function getAllItems() {
    const response = await fetch(api_url + 'all');
    const data = await response.json();
    const items = data.data;
    return items;
}

getAllItems()
    .then((items)=>{
        items.forEach(item=>{
            showAllItems(item);
            console.log(item.category);
        });
    })

function showAllItems(item){
    const element = document.createElement('div');
    compendium.appendChild(element);
    switch (item.category) {
        case 'monsters':
            item = new Monster(element, item.name, item.image, item.category, item.description, item.common_locations, item.dlc, item.drops);
            item.showMonster();
            break;
    
        default:
            break;
    }
}

//base class for all items
class Item{
    constructor(element, name, image, category, description, location, dlc){
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
class Monster extends Item{
    constructor(element, name, image, category, description, location, dlc, drops){
        super(element, name, image, category, description, location, dlc);
        this.drops = drops;
    }

    showMonster(){
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

class Equipment extends Item{
    constructor(element, name, image, category, description, location, dlc, attack, defense){
        super(element, name, image, category, description, location, dlc);
        this.attack = attack;
        this.defense = defense;
    }
}

class Material extends Item{
    constructor(element, name, image, category, description, location, dlc, drops, hearts, cooking){
        super(element, name, image, category, description, location, dlc);
        this.drops = drops;
        this.hearts = hearts;
        this.cooking = cooking;
    }
}

class Creature extends Item{
    constructor(element, name, image, category, description, location, dlc, drops, cooking, edible, hearts){
        super(element, name, image, category, description, location, dlc)
        this.drops = drops;
        this.cooking = cooking;
        this.edible = edible;
        this.hearts = hearts;
    }
}

class Treasure extends Item{
    constructor(element, name, image, category, description, location, dlc, drops){
        super(element, name, image, category, description, location, dlc);
        this.drops = drops;
    }
}