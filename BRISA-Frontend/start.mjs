const rawPort = process.env.PORT;

if (rawPort === undefined || rawPort.trim() === "") {
	throw new Error("PORT environment variable is required");
}

if (!/^\d+$/.test(rawPort)) {
	throw new Error(`Invalid PORT value: ${rawPort}`);
}

const port = Number(rawPort);

if (!Number.isInteger(port) || port < 0 || port >= 65536) {
	throw new Error(`Invalid PORT value: ${rawPort}`);
}

process.env.PORT = String(port);

await import("./build/index.js");
