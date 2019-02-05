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