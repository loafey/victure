var uploadButton = document.getElementById("upload-button");

function fileUpload() {
    document.getElementById("file-input").click();
}

function dropHandler(ev) {
    ev.preventDefault();
    //var reader = new FileReader();

    if (ev.dataTransfer.items) {
        for (i = 0; i < ev.dataTransfer.items.length; i++) {
            if (ev.dataTransfer.items[i].kind === "file") {
                var file = ev.dataTransfer.items[i].getAsFile();
                //console.log("file[" + i + "].name = " + ev.dataTransfer.files[i].name);
                console.log(URL.createObjectURL(ev.dataTransfer.files[i]));
                document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(ev.dataTransfer.files[i]) + ")";
            }
        }
    } else {
        for (i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log("file[" + i + "].name = " + ev.dataTransfer.files[i].name);
        }
    }
    removeDragData(ev);
}

function fileUploadButton(file) {
    console.log(file);
    console.log(URL.createObjectURL(file[0]));
    document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(file[0]) + ")";
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function removeDragData(ev) {
    if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
    } else {
        ev.dataTransfer.clearData();
    }
}