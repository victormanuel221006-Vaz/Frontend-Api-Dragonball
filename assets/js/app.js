window.onload = function () {
    cargarPrimeros();
};

function cargarPrimeros() {
    const url = `https://dragonball-api.com/api/characters?limit=30 `;

    fetch(url)
        .then(res => res.json())
        .then(data => mostrarPersonajes(data.items));
}

function buscarPersonaje() {
    const nombre = document.getElementById("busqueda").value.toLowerCase();

    fetch(`https://dragonball-api.com/api/characters?name=${nombre}`)
        .then(res => res.json())
        .then(data => {

            if (!data || data.length === 0) {
                document.getElementById("contenedor").innerHTML = `
                    <div style="
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        justify-content:center;
                        margin-top:40px;
                    ">
                        <h2 style="text-align:center;">
                            No se encontró el personaje ${nombre}
                        </h2>

                        <img src="assets/img/triste.gif" 
                            style="width:200px; margin-top:20px;">
                    </div>
                `;
                return;
            }

            if (!Array.isArray(data)) {
                mostrarPersonajes([data]);
            } else {
                mostrarPersonajes(data);
            }
        });
}

function mostrarPersonajes(lista) {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    lista.forEach(personaje => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h2 style="color:white; text-align:center;">
                ${personaje.name}
            </h2>

            <img src="${personaje.image}" 
                id="img-${personaje.id}"
                style="width:150px; border-radius:10px; cursor:pointer;">

            <p><b>Ki:</b> ${personaje.ki}</p>
            <p><b>Max Ki:</b> ${personaje.maxKi}</p>
            <p><b>Raza:</b> ${personaje.race}</p>
            <p><b>Género:</b> ${personaje.gender}</p>
        `;

        const imagen = card.querySelector(`#img-${personaje.id}`);
        imagen.onclick = () => verDetalle(personaje.id);

        contenedor.appendChild(card);
    });
}

function verDetalle(id) {

    fetch(`https://dragonball-api.com/api/characters/${id}`)
        .then(res => res.json())
        .then(p => {

            const contenedor = document.getElementById("contenedor");
            contenedor.innerHTML = "";

            const card = document.createElement("div");
            card.style.maxWidth = "700px";
            card.style.margin = "auto";
            card.style.background = "#111";
            card.style.padding = "40px";
            card.style.borderRadius = "20px";

            card.innerHTML = `
                <h2 style="color:yellow"text-align: "center;">${p.name}</h2>

                <div style="text-align:center;">
                <div class="pimg"><img src="${p.image}" width="200" style="border-radius:10px;"></div>
                </div>

                <p><b>Ki:</b> ${p.ki}</p>
                <p><b>Max Ki:</b> ${p.maxKi}</p>
                <p><b>Raza:</b> ${p.race}</p>
                <p><b>Género:</b> ${p.gender}</p>

                <p style="margin-top:15px; line-height:1.5;">
                    ${p.description}
                </p>

                <h3 style="color:orange; margin-top:20px;">Transformaciones</h3>

                <div id="transformaciones" style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:15px;
                    justify-content:center;
                "></div>

                <br>
                <button onclick="cargarPrimeros()">Volver</button>
            `;

            contenedor.appendChild(card);

            const transDiv = document.getElementById("transformaciones");

            if (p.transformations && p.transformations.length > 0) {

                const ordenadas = p.transformations.sort((a, b) => {
                    return parseInt(a.ki.replace(/\D/g, '')) - parseInt(b.ki.replace(/\D/g, ''));
                });

                ordenadas.forEach(t => {

                    const div = document.createElement("div");
                    div.style.background = "#222";
                    div.style.padding = "50px";
                    div.style.borderRadius = "50px";
                    div.style.textAlign = "center";
                    div.style.width = "220px";

                    div.innerHTML = `
                        <h4 style="color:white;">${t.name}</h4>
                        <div class="imgdet"><img src="${t.image}" width="100"><br></div>
                        
                        <small>Ki: ${t.ki}</small>
                    `;

                    transDiv.appendChild(div);
                });

            } else {
                transDiv.innerHTML = "<p>No tiene transformaciones</p>";
            }
        });
}
function filtrarPorRaza() {
    const raza = document.getElementById("filtroRaza").value;

    fetch("https://dragonball-api.com/api/characters?limit=100")
        .then(res => res.json())
        .then(data => {

            if (raza === "") {
                mostrarPersonajes(data.items);
                return;
            }

            const filtrados = data.items.filter(p => 
                p.race && p.race.toLowerCase() === raza.toLowerCase()
            );

            mostrarPersonajes(filtrados);
        });
}