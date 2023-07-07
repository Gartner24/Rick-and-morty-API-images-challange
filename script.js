const tbody = document.querySelector('tbody');

// Función que obtiene la data de la API
const getData = async (url) => {
	const response = await fetch(url);
	const data = await response.json();
	return data.results;
};

// Función que imprime la data en el DOM
const printRow = (character, container, image2) => {
	let row = document.createElement('tr');
	row.setAttribute('id', character.id);
	row.innerHTML = `
    ${
		image2
			? `
            <td class="ch-name">${character.name}</td>
            <td class="ch-caracteristics">
                ${
					character.status == 'Alive'
						? '<i class="green-dot"></i>'
						: character.status == 'Dead'
						? '<i class="red-dot"></i>'
						: '<i class="grey-dot"></i>'
				}
                • ${character.species} • ${character.gender} • ${
					character.origin.name
			  } • ${character.location.name}
            </td>
                <td class="ch-images">
                    <img src="${character.image}" alt="${character.name}">
                    <img src="${image2}" alt="${character.name}">
                </td>
    `
			: ''
	}`;
	container.appendChild(row);
	if (image2) return true;
	else return false;
};

// Obtener imagen del personaje con el mismo nombre pero que no sea el mismo personaje (si existe) y buscar la imagen desde el personaje actual por id
const searchCharacterImage = (character, data) => {
	const characterImage = data.find((character2) => {
		const characterName = character2.name.toLowerCase();
		const searchName = character.name.toLowerCase();
		// return characterName.includes(searchName) && character2.id !== character.id;
		return (
			characterName != searchName &&
			characterName.includes(searchName.split(' ')[0]) &&
			character.species == character2.species &&
			character.gender == character2.gender
		);
	});
	return characterImage ? characterImage.image : false;
};

// Obtener datos de la API de forma asíncrona
const fetchData = async () => {
	const results = [];
	for (let page = 1; page <= 42; page++) {
		const url = `https://rickandmortyapi.com/api/character?page=${page}`;
		const data = await getData(url);
		results.push(...data);
	}
	return results;
};

// Obtener un número aleatorio entre 0 y el número máximo de personajes
const getRandomIndex = (max, usedIndexes) => {
	let randomIndex = Math.floor(Math.random() * max);

	while (usedIndexes.includes(randomIndex))
		randomIndex = Math.floor(Math.random() * max);
	return randomIndex;
};

// Imprimir la tabla con los datos obtenidos
fetchData() //results
	.then((charactersArray) => {
		// Data sin renderizar aleatoriamente

		// data.forEach((character) => {
		// 	const characterImage = searchCharacterImage(character, data);
		// 	printRow(character, tbody, characterImage);
		// });

		// Data pero renderizando aleatoriamente
		console.log(charactersArray);
		const usedIndexes = [];
		let printedRow = false;
		for (let i = 0; i < 10; printedRow ? i++ : i) {
			const randomIndex = getRandomIndex(
				charactersArray.length,
				usedIndexes
			);
			const character = charactersArray[randomIndex];
			const characterImage = searchCharacterImage(
				character,
				charactersArray
			);
			printedRow = printRow(character, tbody, characterImage);
			console.log(printedRow)
			usedIndexes.push(randomIndex);
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
