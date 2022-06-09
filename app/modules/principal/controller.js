const {
    ipcRenderer
} = require("electron");



// Capture input from the user
let inputFile = document.querySelector('input[type="file"]');
inputFile.addEventListener('change', (event) => {
    console.log(event.target.files);

    let files = event.target.files;
    let file = files[0];
    let fileName = file.name;
    let filePath = file.path;
    filePath = filePath.replace(fileName, '');
    // get directory path
    console.log("fileName: " + fileName);
    console.log("filePath: " + filePath);


    ipcRenderer.send("sendPath", filePath);



});

new Promise((resolve, reject) => { // espera hasta que la promesa se resuelva (*)
    ipcRenderer.on("sendFiles", (event, arg) => {


        let cardGruup = document.querySelector('#card-group');
        cardGruup.classList.remove('visually-hidden');


        // data = arg;
        resolve(arg);
        console.log("Esto es del backed ", arg);
        let filesCard = document.querySelector('#files-card');
        let cardHeader = filesCard.querySelector('.card-header')
        cardHeader.innerHTML = '';

        let div = document.createElement('div');
        div.classList.add('ms-2', 'me-auto');

        let div2 = document.createElement('div');
        div2.classList.add('fw-bold');
        div2.textContent = "Archivos a filtrar";
        div.appendChild(div2);

        let span = document.createElement('span');
        span.textContent = arg[0].length;
        span.classList.add('badge', 'rounded-pill', 'bg-primary');

        cardHeader.append(div, span);

        let ulFiles = document.querySelector('ul');
        ulFiles.innerHTML = '';

        arg[0].forEach(file => {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = file;
            ulFiles.appendChild(li);
        });

        console.log(arg[1]);
        let cardBody = document.querySelectorAll('.card-body')[1]
        cardBody = cardBody.querySelector('.row');
        cardBody.innerHTML = '';

       for(let category in arg[1]){
            let div = document.createElement('div');
            div.classList.add('col-md-6');
            div.style.height = '150px';

            let ul = document.createElement('ul');
            ul.classList.add('list-group','overflow-auto');
            ul.style.height = '80%';

            let liHeader = document.createElement('li');
            liHeader.classList.add('list-group-item', 'list-group-item-secondary', 'text-dark', 'text-capitalize');
            liHeader.textContent = category;
            ul.append(liHeader);

            arg[1][category].name.forEach(file => {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = file;
                ul.appendChild(li);
            });
            div.append(ul);
            cardBody.append(div);
        };

    });
});