const path = require('path');
const os = require('os');
const fs = require('fs');
const {
    ipcMain
} = require('electron');


console.log(__dirname)

function readFilesController() {

    // arrays to store file extensions
    let extensions = {
        "imágenes": ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "svg", "ico"],
        "videos": ["mp4", "avi", "mkv", "mov", "flv", "wmv", "mpg", "mpeg", "3gp", "m4v", "mts", "m2ts", "ts", "webm", "vob", "m4p", "m4v", "m4b", "m4r", "m4a", "aac", "mp3", "wav", "wma", "ogg", "oga", "mid", "midi", "wv", "amr", "aif", "aiff", "aifc", "cda", "au", "snd", "flac", "m4a", "m4p", "m4b", "m4r", "mp3", "wav", "wma", "ogg", "oga", "mid", "midi", "wv", "amr", "aif", "aiff", "aifc", "cda", "au", "snd", "flac"],
        "audios": ["mp3", "wav", "flac", "ogg", "wma"],
        "documentos": ["pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "md", "markdown"],
        "ejecutables": ["exe", "msi", "dev"],
        "comprimidos": ["zip", "rar", "7z", "tar", "gz", "bz2"],
        "isos": ["iso"],
        "torrents": ["torrent"],
        "stls": ["stl"],
        "código": ["js", "html", "css", "json", "xml", "py", "c", "cpp", "java", "php", "sql", "sh", "bat", "vb", "vbs", "asp", "aspx", "cs", "cshtml", "dart", "go", "h", "hpp", "ini", "java", "js", "jsp", "lua", "m", "md", "pl", "properties", "py", "rb", "sh", "swift", "vb", "vbs", "xml", "yml"],
    }

    filterData = {};
    filterPath = "";

    ipcMain.on('sendPath', (event, arg) => {
        filterPath = "";
        filterData = {};

        let filesFiltered = [];
        filterPath = arg;

        let files = fs.readdirSync(filterPath);

        files.forEach(file => {
            let filePath = path.join(filterPath, file);

            fs.lstatSync(filePath).isDirectory() ? null : filesFiltered.push(file) // if is a directory, do nothing;

            let fileExtension = file.split('.').pop();

            for (let key in extensions) {
                if (extensions[key].includes(fileExtension)) {

                    if (!filterData[key]) {
                        filterData[key] = [];
                    }
                    filterData[key].push(file);
                }
            }
        });


        event.sender.send('sendFiles', filterData);
    });

    ipcMain.on('filterFiles', (event, arg) => {

        let pathFilesOrdered = path.join(filterPath, "archivos_ordenados");
        // Comprobamos si existe la carpeta archivos_ordenados
        fs.existsSync(pathFilesOrdered) ? null : fs.mkdirSync(pathFilesOrdered);
        message = ["ok", null];
        // Recorremos las categorías
        for (let key in filterData) {

            capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            // Comprobamos si existen los directorios de cada categoría
            let pathCategory = path.join(pathFilesOrdered, capitalizedKey);
            fs.existsSync(pathCategory) ? null : fs.mkdirSync(pathCategory);

            // Recorremos los datos de cada categoría
            filterData[key].map(file => {

                let filePath = path.join(pathCategory, file);

                function itsDuplicity(fFilePath) {

                    // Comprobamos si existe el archivo
                    if (fs.existsSync(fFilePath)) {
       
                        let filesDestination = fs.readdirSync(pathCategory);

                        // Comprobamos cuantas veces existe esta duplicidad
                        let count = filesDestination.filter(file => file.includes(file)).length;

                        // Si existe la duplicidad, añadimos un número al final del nombre
                        if (count > 0) {
                            count++;
                            newFilePath = fFilePath.split(".")[0] + " - (Duplicado)." + fFilePath.split(".")[1];
                        }
                        return [newFilePath, "true"];
                        // mientras exista la duplicidad, añadimos un número al final del nombre
                    } else {
                        return [fFilePath, "false"];
                    }
                }

                let newPath = filePath;

                do {
                    fileResult = itsDuplicity(newPath);
                    fileResult[1] == "false" ? null :  newPath = fileResult[0];

                } while (fileResult[1] != "false");

                if (fileResult[1] == "false") {

                    // Movemos los archivos a la carpeta correspondiente
                    try {
                        fs.renameSync(path.join(filterPath, file), newPath);
                    } catch (error) {
                        menssage = ["error", error];
                        console.log(error);
                    }
                }
            });
        }
        event.sender.send('filesFiltered', message);
        // Reseteamos variables globales
        filterData = {};
        filterPath = "";
    });
}

exports.controllerReadFiles = readFilesController();