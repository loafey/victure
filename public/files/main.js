var linkEl = document.createElement("input");
document.body.appendChild(linkEl);
linkEl.style.display = "none";
linkEl.style.position = "absolute";
linkEl.value = window.location.href;

function copyLink() {
    //toast("Link copied!", 5);
    linkEl.style.display = "block";
    linkEl.select();
    document.execCommand("copy");
    linkEl.style.display = "none";
}

function openLink(link) {
    window.open(link, "_self");
}

if (pugFileType.includes("image")) {} else if (pugFileType.includes("video")) {
    var videoParent = document.getElementById("uploadedImage").parentElement;
    var imageSource = document.getElementById("uploadedImage").src;
    videoParent.removeChild(document.getElementById("uploadedImage"));
    var videoPlayer = document.createElement("video");
    var videoPlayerSource = document.createElement("source");
    videoPlayer.append(videoPlayerSource);
    videoPlayer.classList.add("video-player");
    videoPlayer.controls = true;
    videoPlayerSource.src = imageSource;
    videoPlayerSource.type = pugFileType;
    videoParent.insertBefore(videoPlayer, document.getElementById("delete"));
} else {
    var fileParent = document.getElementById("uploadedImage").parentElement;
    var fileSource = document.getElementById("uploadedImage").src;
    fileParent.removeChild(document.getElementById("uploadedImage"));
    var fileElement = document.createElement("p");
    fileElement.id = "file-element";
    fileElement.innerHTML = "<a href='" + fileSource + "'>Download</a>";

    var fileImage = document.createElement("img");
    fileImage.src = "/upload/file.svg";
    fileImage.style.height = "200px";

    var fileDiv = document.createElement("div");
    fileDiv.appendChild(fileImage);
    fileDiv.appendChild(fileElement);

    fileParent.insertBefore(fileDiv, document.getElementById("delete"));
}