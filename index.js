let digimonList;
let questList;
let selectedDigimon;

function selectDigimon(digiCard) {
	selectedDigimon = digimonList[digiCard.id];
	//If the card is already selected, do nothing.
	if (digiCard.classList.contains("selected")) {
		console.log("already selected")
		return false;
	}
	console.log(digiCard)
	//Remove the selected card from the others...
	const prevSelection = document.getElementsByClassName('digiCard selected');
	if (prevSelection.length > 0 ) {
		for (const elem of prevSelection) {
			elem.classList.remove('selected')
		}
	}
	digiCard.classList.add('selected');
}

function loadDigimonList(data) {
	console.log(data);
	digimonList = data;
	//Get the digimon list div...
	//Loop through the digimon to populate.
	for (const [key, value] of Object.entries(data)) {
		//Digimon Card...
		//Look for the right div to put into.
		document.getElementById(`stage-${value.Stage}`).insertAdjacentHTML('beforeend',`<div id="${key}" class="digiCard col-2"><img src="${value.Sprite}" /><br/><span>${key}</span></div>`);
		// digimonDiv.insertAdjacentHTML('beforeend',`<div id="${key}" class="digiCard"><img src="${value.Sprite}" /><span>${key}</span></div>`);
	}
	//Add the click events after... probs can be better but ehhh.
	const digiCards = document.getElementsByClassName('digiCard');
	for (const digiCard of digiCards) {
		digiCard.onclick = function() {
			selectDigimon(this);
		}
	}
}

function fetchDigimonData() {
	fetch('digimon.json').then(response => {
		if (!response.ok) {
			console.error(response);
			throw new Error(`Failed to get Digimon! Status: ${response.status}`);
		}
		return response.json();
	})
	.then (data => loadDigimonList(data))
	.catch(error => console.error('Failed to fetch data:', error));
}

function loadQuestList(data) {
	questList = data;
	console.log(questList);
}

function fetchQuestData() {
	fetch('quests.json').then(response => {
		if (!response.ok) {
			console.error(response);
			throw new Error(`Failed to get Digimon! Status: ${response.status}`);
		}
		return response.json();
	})
	.then (data => questList = data)
	.catch(error => console.error('Failed to fetch data:', error));
}
fetchDigimonData();
fetchQuestData();


function calculateQuestChance() {
	if (selectedDigimon == null) {
		console.log("nothing Selected")
		return false;
	}

	//Empty...
	document.querySelector('#questList table tbody').innerHTML = ""
	
	//Loop through the quests to populate.
	for (const [key, value] of Object.entries(questList)) {
		//Quest row...
		let questHTML = '';
		let leftover = 5;
		for (const questItem of value) {
			questHTML += `<td>${calculateVictory(questItem.Attribute, questItem.Power)}</td>`
			leftover -= 1;
		}
		for (let i = 0; i < leftover; i ++) {
			questHTML += `<td>-</td>`
		}
		document.querySelector('#questList table tbody').insertAdjacentHTML('beforeend',`<tr class="questRow"><td>${key}</td>${questHTML}</tr>`);
	}
}


function calculateVictory(enemyAttribute, enemyPower) {
	var advantage = 0;
	const attribute = selectedDigimon.Attribute;
	var egg = document.getElementById('playerEgg').checked;
	var power = selectedDigimon.Power;
	if (attribute == "Vaccine") {
		if (enemyAttribute == "Data") {
		advantage = -5;
		} else if (enemyAttribute == "Virus") {
		advantage = 5;
		} else {
		advantage = 0;
		};
	} else if (attribute == "Data") {
		if (enemyAttribute == "Vaccine") {
		advantage = 5;
		} else if (enemyAttribute == "Virus") {
		advantage = -5;
		} else {
		advantage = 0;
		};
	} else if (attribute == "Virus") {
		if (enemyAttribute == "Vaccine") {
		advantage = -5;
		} else if (enemyAttribute == "Data") {
		advantage = 5;
		} else {
		advantage = 0;
		};
	} else {
		advantage = 0;
	};
	switch (selectedDigimon.Stage) {
		case "III":
			bonus =5;
		break;
		case "IV":
			bonus = 8;
		break;
		case "V":
			bonus = 15;
		break;
		case "VI":
		case "VI+":
			bonus = 25;
		break;
	};
	if (egg) {
		bonus *= 2;
	};
	power += bonus;
	var hitRate = ((power * 100)/(power + enemyPower)) + advantage;
	if (hitRate > 100) {
		var hitRate = 100;
	} else if (hitRate < 0) {
		var hitRate = 0;
	};
	// var dice = Math.floor(Math.random() * (100))
	// if (dice < hitRate) {
	// 	var scenario = "HIT";
	// 	document.getElementById("scenario").innerHTML = scenario;
	// } else if (dice >= hitRate) {
	// 	var scenario = "MISS";
	// 	document.getElementById("scenario").innerHTML = scenario;
	// }  else {
	// 	var scenario = "Hey, what are you trying to pull?";
	// 	document.getElementById("scenario").innerHTML = scenario;
	// };
		// document.getElementById("hitRate").innerHTML = 
	return hitRate.toFixed(2) + '%';
		// document.getElementById("power").innerHTML = power;
}

