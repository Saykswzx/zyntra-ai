document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("send");
    const messagesContainer = document.getElementById("messages");

    let etapaAgendamento = 0; 
    let dadosAgendamento = { setor: "", nome: "", email: "", telefone: "", data: "" };

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

            // === LÓGICA DE AGENDAMENTO INTELIGENTE E COMPLETA ===
            if (etapaAgendamento > 0) {
                setTimeout(() => {
                    if (etapaAgendamento === 1) {
                        dadosAgendamento.setor = texto;
                        etapaAgendamento = 2;
                        botDiv.textContent = `Perfeito! Setor de ${dadosAgendamento.setor}. Qual é o seu **nome completo**?`;
                    } else if (etapaAgendamento === 2) {
                        dadosAgendamento.nome = texto;
                        etapaAgendamento = 3;
                        botDiv.textContent = `Obrigado, ${dadosAgendamento.nome}! Agora, por favor, digite seu **e-mail** para contato:`;
                    } else if (etapaAgendamento === 3) {
                        dadosAgendamento.email = texto;
                        etapaAgendamento = 4;
                        botDiv.textContent = `Ótimo! E qual é o seu número de **WhatsApp / Telefone** (com DDD)?`;
                    } else if (etapaAgendamento === 4) {
                        dadosAgendamento.telefone = texto;
                        etapaAgendamento = 5;
                        botDiv.textContent = `Quase acabando! Para qual **data e horário** você deseja agendar? (Ex: Amanhã às 15h)`;
                    } else if (etapaAgendamento === 5) {
                        dadosAgendamento.data = texto;
                        etapaAgendamento = 0; // Finaliza o agendamento
                        botDiv.textContent = `✅ **Agendamento Confirmado com Sucesso!**\n\n📌 Setor: ${dadosAgendamento.setor}\n👤 Nome: ${dadosAgendamento.nome}\n📧 E-mail: ${dadosAgendamento.email}\n📱 Telefone: ${dadosAgendamento.telefone}\n📅 Data/Horário: ${dadosAgendamento.data}\n\nEnviaremos a confirmação e os detalhes de acesso e lembretes diretamente para o seu e-mail e WhatsApp informados. Como posso ajudar com mais alguma coisa?`;
                    }
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 800);
                return;
            }
            // ====================================================

            try {
                // 3. Envia para o backend no Render, forçando contexto de negócios e agendamento profissional
                const promptProfissional = `Você é a Zyntra, uma inteligência artificial corporativa de automação e atendimento de empresas. Responda sempre focada no ambiente de trabalho, negócios e agendamentos profissionais (como clínicas, restaurantes, consultórios e prestadores de serviço), nunca em tarefas escolares ou curiosidades. Pergunta do usuário: ${texto}`;

                const response = await fetch("https://zyntra-ai-s40h.onrender.com/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ mensagem: promptProfissional })
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
        etapaAgendamento = 1; 
        
        const userDiv = document.createElement("div");
        userDiv.classList.add("user");
        userDiv.textContent = "Quero fazer um agendamento";
        messagesContainer.appendChild(userDiv);

        const botDiv = document.createElement("div");
        botDiv.classList.add("bot");
        botDiv.textContent = "Olá! Vamos iniciar seu agendamento corporativo. Para qual setor seria? (Ex: Psicólogo, Restaurante, Barbearia, etc.)";
        messagesContainer.appendChild(botDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Funções para os outros dois botões novos
    window.consultarServicos = function() {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user");
        userDiv.textContent = "Quais serviços a Zyntra automatiza?";
        messagesContainer.appendChild(userDiv);

        const botDiv = document.createElement("div");
        botDiv.classList.add("bot");
        botDiv.textContent = "A Zyntra automatiza atendimentos via chat 24h, agendamentos inteligentes, triagem de clientes e integração de fluxos para empresas de todos os portes!";
        messagesContainer.appendChild(botDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    window.falarSuporte = function() {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user");
        userDiv.textContent = "Preciso falar com o suporte humano";
        messagesContainer.appendChild(userDiv);

        const botDiv = document.createElement("div");
        botDiv.classList.add("bot");
        botDiv.textContent = "Claro! Você pode enviar uma mensagem direta para a nossa equipe através da aba 'Contato' no topo da página ou aguardar que um atendente humano assuma o chat.";
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
