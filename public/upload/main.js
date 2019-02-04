/*jshint esversion: 6 */
var fileToUpload;

function sendImage() {
    var formContent = new FormData();
    formContent.append("image", fileToUpload);
    formContent.append("name", "file");

    //formContent.append("password", document.getElementById("upload-after-buttons-password").value);

    var selectedTime = 0;
    var timeoutRange = document.getElementById("timeout-range").value;
    if (timeoutRange == 1) {
        selectedTime = 5;
    } else {
        selectedTime = timeoutRange * 5;
    }
    formContent.append("deleteTime", selectedTime);

    var request = new XMLHttpRequest();
    request.open("POST", "/file_upload", true);
    request.setRequestHeader("file", "image");
    request.send(formContent);

    request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
            window.open(request.responseText, "_blank");
            var tempIframe = document.createElement("iframe");
            tempIframe.style.display = "none";
            tempIframe.src = request.responseText;
            document.body.appendChild(tempIframe);
        }
    };
}

function fileUpload() {
    document.getElementById("file-input").click();
}

function dropHandler(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        for (i = 0; i < ev.dataTransfer.items.length; i++) {
            if ((ev.dataTransfer.items[i].kind === "file") && (ev.dataTransfer.items[i].type.match("^image/*"))) {
                //document.getElementById("test-image").style.backgroundImage = "url(" + URL.createObjectURL(ev.dataTransfer.files[i]) + ")";
                document.getElementById("test-image-inside").src = URL.createObjectURL(ev.dataTransfer.files[i]);
                //fileToUpload = URL.createObjectURL(ev.dataTransfer.files[i]);
                fileToUpload = ev.dataTransfer.files[i];
                uploadFinished();
            }
        }
    }
    removeDragData(ev);
}

function fileUploadButton(file) {
    document.getElementById("test-image-inside").src = URL.createObjectURL(file[0]);
    fileToUpload = file[0];
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
    document.getElementById("test-image").style.display = "block";
    document.getElementById("upload-after-buttons").style.display = "block";
}

function updateDeleteTimer() {
    var selectedTime = 0;
    var timeoutRange = document.getElementById("timeout-range").value;

    if (timeoutRange == 1) {
        selectedTime = 5;
    } else {
        selectedTime = timeoutRange * 5;
    }

    document.getElementById("timeout-time-a").innerHTML = "Automaticly deletes after " + selectedTime + " minutes.";
}
updateDeleteTimer();

function reloadPage() {
    location.reload();
}