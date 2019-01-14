var uploadButton = document.getElementById("upload-button");

function fileUpload() {
    document.getElementById("file-input").click();
}

function dropHandler(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        for (i = 0; i < ev.dataTransfer.items.length; i++) {
            if ((ev.dataTransfer.items[i].kind === "file") && (ev.dataTransfer.items[i].type.match("^image/*"))) {
                var file = ev.dataTransfer.items[i].getAsFile();
                document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(ev.dataTransfer.files[i]) + ")";
                uploadFinished();
            }
        }
    }
    removeDragData(ev);
}

function fileUploadButton(file) {
    document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(file[0]) + ")";
    uploadFinished();
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

function uploadFinished() {
    document.getElementById("upload-div").style.display = "none";
    //document.getElementById("test-image").style.gridColumn = "1";
    document.getElementById("test-image").style.display = "block";
    document.getElementById("upload-after-buttons").style.display = "block";
}

function updateDeleteTimer() {
    var timeoutRange = document.getElementById("timeout-range").value;
}