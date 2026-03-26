const form = document.getElementById("solver-form");
const inicioInput = document.getElementById("inicio");
const finalInput = document.getElementById("final");
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("results");
const stepsCount = document.getElementById("steps-count");
const solveBtn = document.getElementById("solve-btn");
const exampleBtn = document.getElementById("example-btn");

const API_URL = "https://dfs-problem.vercel.app/calcular";

function parseState(rawValue) {
	return rawValue
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item !== "")
		.map((item) => Number(item));
}

function isValidState(state) {
	return state.length === 4 && state.every((value) => Number.isFinite(value));
}

function setStatus(message, tone = "neutral") {
	statusText.textContent = message;
	statusText.className = "text-sm";

	if (tone === "error") {
		statusText.classList.add("text-red-600", "font-semibold");
		return;
	}

	if (tone === "success") {
		statusText.classList.add("text-emerald-700", "font-semibold");
		return;
	}

	statusText.classList.add("text-slate-600");
}

function clearResults() {
	resultsContainer.innerHTML = "";
	stepsCount.textContent = "0 pasos";
}

function renderResults(route) {
	clearResults();

	if (!Array.isArray(route) || route.length === 0) {
		resultsContainer.innerHTML = `
			<div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
				No se obtuvo una ruta valida.
			</div>
		`;
		return;
	}

	stepsCount.textContent = `${route.length - 1} pasos`;

	route.forEach((state, index) => {
		const card = document.createElement("article");
		card.className =
			"flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm";

		const step = document.createElement("p");
		step.className = "text-sm font-semibold uppercase tracking-wide text-slate-500";
		step.textContent = `Paso ${index}`;

		const value = document.createElement("p");
		value.className = "text-base font-bold text-slate-800 md:text-lg";
		value.textContent = `[${state.join(", ")}]`;

		card.appendChild(step);
		card.appendChild(value);
		resultsContainer.appendChild(card);
	});
}

exampleBtn.addEventListener("click", () => {
	inicioInput.value = "4,2,3,1";
	finalInput.value = "1,2,3,4";
	setStatus("Ejemplo cargado. Pulsa 'Calcular ruta'.");
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const inicio = parseState(inicioInput.value);
	const final = parseState(finalInput.value);

	if (!isValidState(inicio) || !isValidState(final)) {
		clearResults();
		setStatus(
			"Formato invalido. Debes ingresar 4 numeros separados por comas en cada campo.",
			"error"
		);
		return;
	}

	solveBtn.disabled = true;
	solveBtn.classList.add("opacity-60", "cursor-not-allowed");
	setStatus("Consultando API...");

	try {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ inicio, final }),
		});

		if (!response.ok) {
			throw new Error("La API devolvio un estado no exitoso.");
		}

		const data = await response.json();
		renderResults(data.ruta);
		setStatus("Ruta calculada correctamente.", "success");
	} catch (error) {
		clearResults();
		setStatus(
			"No fue posible conectar con la API. Verifica que Flask este activo en localhost:5000.",
			"error"
		);
		console.error(error);
	} finally {
		solveBtn.disabled = false;
		solveBtn.classList.remove("opacity-60", "cursor-not-allowed");
	}
});
