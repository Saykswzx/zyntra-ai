document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("send");
    const messagesContainer = document.getElementById("messages");

    async function enviarMensagem() {
        const texto = input.value.trim();

        if (texto !== "") {
            // 1. Cria a bolha com a mensagem do usuário
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.textContent = texto;
            messagesContainer.appendChild(userDiv);

            input.value = "";
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // 2. Cria a bolha de "pensando" da IA
            const botDiv = document.createElement("div");
            botDiv.classList.add("bot");
            botDiv.textContent = "Zyntra AI está digitando...";
            messagesContainer.appendChild(botDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                // 3. Envia para o seu backend rodando na porta 3000
                const response = await fetch("https://zyntra-ai-s40h.onrender.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ mensagem: texto })
                });

                const data = await response.json();

                // 4. Exibe a resposta REAL trazida do Groq (Llama 3)
                botDiv.textContent = data.resposta;

            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                botDiv.textContent = "Ops! O servidor parece estar offline.";
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    sendBtn.addEventListener("click", enviarMensagem);

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            enviarMensagem();
        }
    });
});
