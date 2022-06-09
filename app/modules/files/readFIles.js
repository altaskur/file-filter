const path = require('path');
const os = require('os');
const fs = require('fs');
const {
    ipcMain
} = require('electron');

function readFilesController() {

    // arrays to store file extensions
    let extensions = {
        "imágenes": ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "svg", "ico"],
        "videos": ["mp4", "avi", "mkv", "mov", "flv", "wmv", "mpg", "mpeg", "3gp", "m4v", "mts", "m2ts", "ts", "webm", "vob", "m4p", "m4v", "m4b", "m4r", "m4a", "aac", "mp3", "wav", "wma", "ogg", "oga", "mid", "midi", "wv", "amr", "aif", "aiff", "aifc", "cda", "au", "snd", "flac", "m4a", "m4p", "m4b", "m4r", "mp3", "wav", "wma", "ogg", "oga", "mid", "midi", "wv", "amr", "aif", "aiff", "aifc", "cda", "au", "snd", "flac"],
        "audios": ["mp3", "wav", "flac", "ogg", "wma"],
        "documentos": ["pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "md", "markdown", ],
        "ejecutables": ["exe", "msi", "dev"],
        "comprimidos": ["zip", "rar", "7z", "tar", "gz", "bz2"],
        "isos": ["iso"],
        "torrents": ["torrent"],
        "stls": ["stl"],
        "código": ["js", "html", "css", "json", "xml", "py", "c", "cpp", "java", "php", "sql", "sh", "bat", "vb", "vbs", "asp", "aspx", "cs", "cshtml", "dart", "go", "h", "hpp", "ini", "java", "js", "jsp", "lua", "m", "md", "pl", "properties", "py", "rb", "sh", "swift", "vb", "vbs", "xml", "yml"],
    }

    ipcMain.on('sendPath', (event, arg) => {
        // console.log(arg);
        let filesFiltered = [];
        let filterData = {};

        // let filterData = {
        //     "images": [ 0 ,["path"] ]
        // };

        let files = fs.readdirSync(arg);
        files.forEach(file => {
            let filePath = path.join(arg, file);
            // console.log(filePath);
            // console.log("file: " + file);
            fs.lstatSync(filePath).isDirectory() ? null : filesFiltered.push(file) // if is a directory, do nothing;

            let fileExtension = file.split(".").pop();
            // console.log("fileExtension: " + fileExtension);
            // Filtramos por fileExtension


            for (let key in extensions) {
                if (extensions[key].includes(fileExtension)) {

                    if (filterData[key] == undefined) {

                        filterData[key] = {
                            "path": [filePath],
                            "name": [file],
                            "extension": [fileExtension]
                        };
                    } else {
                        filterData[key].path.push(filePath);
                        filterData[key].name.push(file);

                        filterData[key].extension.forEach(ext => {
                            if (ext != fileExtension) {
                                filterData[key].extension.push(fileExtension);
                            }
                        });
                    }
                };
            };



        });
        console.log(filterData);
        event.sender.send('sendFiles', [filesFiltered, filterData]);
    });

}

exports.controllerReadFiles = readFilesController();