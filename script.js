document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("send");
    const messagesContainer = document.getElementById("messages");

    // Variável para controlar se o usuário está no meio de um agendamento
    let etapaAgendamento = 0; 
    let dadosAgendamento = { setor: "", nome: "", data: "" };

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

            // === LÓGICA DE AGENDAMENTO PASSO A PASSO ===
            if (etapaAgendamento > 0) {
                setTimeout(() => {
                    if (etapaAgendamento === 1) {
                        dadosAgendamento.setor = texto;
                        etapaAgendamento = 2;
                        botDiv.textContent = `Perfeito! Setor de ${dadosAgendamento.setor}. Qual é o seu nome completo?`;
                    } else if (etapaAgendamento === 2) {
                        dadosAgendamento.nome = texto;
                        etapaAgendamento = 3;
                        botDiv.textContent = `Obrigado, ${dadosAgendamento.nome}! Para qual dia e horário você gostaria de agendar?`;
                    } else if (etapaAgendamento === 3) {
                        dadosAgendamento.data = texto;
                        etapaAgendamento = 0; // Finaliza o agendamento
                        botDiv.textContent = `✅ Agendamento confirmado!\n\nSetor: ${dadosAgendamento.setor}\nNome: ${dadosAgendamento.nome}\nData/Horário: ${dadosAgendamento.data}\n\nEntraremos em contato em breve para confirmar!`;
                    }
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 800);
                return;
            }
            // ===========================================

            try {
                // 3. Envia para o seu backend no Render se não estiver agendando
                const response = await fetch("https://zyntra-ai-s40h.onrender.com/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ mensagem: texto })
                });

                const data = await response.json();
                botDiv.textContent = data.resposta;

            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                botDiv.textContent = "Ops! O servidor parece estar offline.";
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Função global para o botão de atalho "Agendar"
    window.iniciarAgendamento = function() {
        etapaAgendamento = 1; // Inicia a etapa 1
        
        // Adiciona mensagem simulando o clique do usuário
        const userDiv = document.createElement("div");
        userDiv.classList.add("user");
        userDiv.textContent = "Quero fazer um agendamento";
        messagesContainer.appendChild(userDiv);

        // Resposta da IA perguntando o setor
        const botDiv = document.createElement("div");
        botDiv.classList.add("bot");
        botDiv.textContent = "Olá! Para qual setor seria o agendamento? (Ex: Psicólogo, Restaurante, Barbearia, etc.)";
        messagesContainer.appendChild(botDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    sendBtn.addEventListener("click", enviarMensagem);

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            enviarMensagem();
        }
    });
});
