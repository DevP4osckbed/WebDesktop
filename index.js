const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const { exec } = require("child_process"); // Needed to run terminal commands

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
	ws.on("message", (message) => {
		const userPrompt = message.toString().replace(/"/g, '\\"'); // Escape quotes for the terminal

		console.log(`User asked: ${userPrompt}`);

		// We use the direct "ollama run" command
		// The --nowordwrap flag helps keep the text clean for your web interface
		exec(
			`ollama run gemma3:270m "${userPrompt}"`,
			(error, stdout, stderr) => {
				if (error) {
					console.error(`Exec Error: ${error.message}`);
					ws.send(
						"Error: Make sure Ollama is installed and the model is downloaded.",
					);
					return;
				}

				// stdout is the actual text response from the AI
				ws.send(stdout.trim());
			},
		);
	});
});

server.listen(PORT, "0.0.0.0", () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
