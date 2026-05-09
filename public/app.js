const startBtn = document.getElementById("start-btn");
const devToggle = document.getElementById("dev-toggle");
const devArea = document.getElementById("dev-area");

startBtn.addEventListener("click", () => {
    const isDev = devToggle.checked;
    const vmUrl = "vm/index.html";

    if (isDev) {
        // DEV MODE: Load in iframe
        devArea.style.display = "block";
        devArea.innerHTML = `<iframe src="${vmUrl}?dev=true" allow="fullscreen; keyboard-map; pointer-lock"></iframe>`;
        startBtn.textContent = "Reload Dev VM";
    } else {
        // STANDARD MODE: External window
        devArea.style.display = "none";
        devArea.innerHTML = ""; // Clean up iframe
        
        window.open(
            vmUrl,
            "VM Session",
            "width=1280,height=720,menubar=no,status=no"
        );
    }
});