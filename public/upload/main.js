var uploadButton = document.getElementById("upload-button");

function fileUpload() {
    document.getElementById("file-input").click();
}

function dropHandler(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        for (i = 0; i < ev.dataTransfer.items.length; i++) {
            if ((ev.dataTransfer.items[i].kind === "file") && (ev.dataTransfer.items[i].type.match("^image/*"))) {
                //document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(ev.dataTransfer.files[i]) + ")";
                document.getElementById("test-image-inside").src = "URL.createObjectURL(ev.dataTransfer.files[i])";
                uploadFinished();
            }
        }
    }
    removeDragData(ev);
}

function fileUploadButton(file) {
    //document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(file[0]) + ")";
    document.getElementById("test-image-inside").src = URL.createObjectURL(file[0]);
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
    setTimeout(function () {
        if (document.getElementById("test-image-inside").clientHeight <= 500) {
            document.getElementById("upload-container").style.gridTemplateRows = document.getElementById("test-image-inside").clientHeight + 10 + "px";
        } else {
            document.getElementById("upload-container").style.gridTemplateRows = "500px";
        }
    }, 100);
    document.getElementById("upload-div").style.display = "none";
    //document.getElementById("test-image").style.gridColumn = "1";
    document.getElementById("test-image").style.display = "block";
    document.getElementById("upload-after-buttons").style.display = "block";
}

function updateDeleteTimer() {
    var selectedTime = 0;
    var timeoutRange = document.getElementById("timeout-range").value;
    console.log(timeoutRange);

    if (timeoutRange == 1) {
        selectedTime = 5;
    } else {
        selectedTime = timeoutRange * 5;
    }

    document.getElementById("timeout-time-a").innerHTML = "Automaticly deletes after " + selectedTime + " minuets.";
}
updateDeleteTimer();

function reloadPage() {
    location.reload();
}