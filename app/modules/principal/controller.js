const {
    ipcRenderer
} = require("electron");


let loading = document.querySelector('h2');     // get loading div

// Capture input from the user
let inputFile = document.querySelector('input[type="file"]');

inputFile.addEventListener('click', (event) => {
    loading.classList.remove('visually-hidden');

    window.setTimeout(() => {
        loading.classList.add('visually-hidden');
        console.log("adios!")
    }, 8000);
});

inputFile.addEventListener('change', (event) => {
    let files = event.target.files;

    let file = files[0];
    let fileName = file.name;
    let filePath = file.path;
    filePath = filePath.replace(fileName, '');
    // get directory path
    loading.classList.remove('visually-hidden');
    ipcRenderer.send("sendPath", filePath);

});

new Promise((resolve, reject) => { // espera hasta que la promesa se resuelva (*)
    ipcRenderer.on("sendFiles", (event, arg) => {// espera hasta que se reciba el mensaje (*)
        resolve(arg); // resuelve la promesa
        loading.classList.add('visually-hidden');

        let filterButton = document.querySelector('input[type="button"]');
        filterButton.classList.remove('visually-hidden');
        filterButton.addEventListener('click', (event) => {
            console.log("hey me has echo click")
        });
        console.log(arg)

        let cardheader = document.querySelector('.card-header');
        cardheader.textContent = "Previsualizando archivos";

        let cardGruup = document.querySelector('#card-group');
        cardGruup.classList.remove('visually-hidden');

        let cardBody = document.querySelector('.card-body')
        cardBody = cardBody.querySelector('.row');
        cardBody.classList.add('g-0');
        cardBody.innerHTML = '';

        for (let category in arg) {
            let categoryContainer = document.createElement('div');
            categoryContainer.classList.add('col-md-5','border','mx-2', 'mb-3', 'rounded');
            categoryContainer.style.height = '200px';



            let categoryHeader = document.createElement('div');
            categoryHeader.classList.add('card-header','w-100','text-capitalize');
            categoryHeader.innerHTML = category + ' <span class="badge text-bg-primary">' + arg[category].length + "</span>";

            let categoryBody = document.createElement('div');
            categoryBody.style.height = '150px';
            categoryBody.classList.add('card-body', 'overflow-auto','p-0');


            let ul = document.createElement('ul');
            ul.classList.add('list-group', 'overflow-auto', 'list-group-flush');

            arg[category].forEach(file => {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = file;
                ul.appendChild(li);
            });

            categoryBody.appendChild(ul);
            categoryContainer.append(categoryHeader, categoryBody);
            cardBody.appendChild(categoryContainer);
        };

    });
});



// });