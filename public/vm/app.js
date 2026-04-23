//app.js - VM appjs
import { Session } from './session.js';

const btn = document.getElementById("vm-start-btn");
const canvas = document.getElementById("desktop-canvas");
const ctx = canvas.getContext("2d");

const session = new Session(canvas, ctx);
session.load();

const isIframe = window.self !== window.top;

btn.addEventListener("click", async () => {
    try {
        // 1. Hardware Locks (Only if not in Dev Iframe)
        if (!isIframe) {
            await document.documentElement.requestFullscreen();
            if (navigator.keyboard?.lock) {
                await navigator.keyboard.lock(["Escape", "Tab"]);
            }
        }

        // 2. Pointer Lock (Works in both modes, requires user gesture)
        await canvas.requestPointerLock();

        // 3. UI Transition
        btn.style.display = "none";
        canvas.style.display = "block";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        session.init();
        startSimulation();
        
    } catch (err) {
        console.warn("Locks skipped:", err);
        btn.style.display = "none";
        canvas.style.display = "block";
        session.init();
        startSimulation();
    }
});

// Re-acquire lock on click (if user pressed Esc to free mouse)
canvas.addEventListener("click", () => {
    if (session.active) canvas.requestPointerLock();
});

// Capture raw mouse motion
document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === canvas) {
        // movementX/Y are the raw deltas (acceleration)
        session.handleInput({ type: "mouseMove", delta: { x: e.movementX, y: e.movementY } });
    }
});

document.addEventListener("mousedown", (e) => {
    if (document.pointerLockElement === canvas) {
        // movementX/Y are the raw deltas (acceleration)
        session.handleInput({ type: "mouseDown", button: e.button });
    }
});

document.addEventListener("mouseup", (e) => {
    if (document.pointerLockElement === canvas) {
        // movementX/Y are the raw deltas (acceleration)
        session.handleInput({ type: "mouseUp", button: e.button });
    }
});

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && !isIframe) {
        btn.style.display = "block";
        btn.textContent = "RESUME";
        canvas.style.display = "none";
        if (navigator.keyboard) navigator.keyboard.unlock();
        session.cleanup();
    }
});

function startSimulation() {
    function frame() {
        session.loop();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

window.addEventListener("resize", () => {
    if (document.fullscreenElement || isIframe) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});