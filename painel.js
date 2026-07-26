// Banco de dados simulado da Equipe Zyntra
let empresasZyntra = [
    {
        id: 1,
        nome: "Tech Solutions Ltda",
        contato: "Carlos Silva",
        plano: "Profissional",
        valor: 197.00,
        renovacao: "15/08/2026",
        status: "Pago"
    },
    {
        id: 2,
        nome: "Inova Comércio",
        contato: "Mariana Souza",
        plano: "Básico",
        valor: 97.00,
        renovacao: "02/08/2026",
        status: "Pendente"
    },
    {
        id: 3,
        nome: "Agência Digital Alfa",
        contato: "Roberto Mendes",
        plano: "Enterprise",
        valor: 497.00,
        renovacao: "28/07/2026",
        status: "Pago"
    }
];

// Função para carregar os dados na tela ao abrir a página
function carregarPainel() {
    const tbody = document.getElementById("tabela-empresas");
    if (!tbody) return;
    tbody.innerHTML = "";

    let totalPago = 0;
    let totalPendente = 0;
    let faturamentoTotal = 0;

    empresasZyntra.forEach(empresa => {
        faturamentoTotal += empresa.valor;
        if (empresa.status === "Pago") totalPago++;
        else totalPendente++;

        let statusClass = "";
        if (empresa.status === "Pago") {
            statusClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        } else if (empresa.status === "Pendente") {
            statusClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        } else {
            statusClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
        }

        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-800/30 transition";
        tr.innerHTML = `
            <td class="py-4 px-6">
                <div class="font-medium text-white">${empresa.nome}</div>
                <div class="text-xs text-slate-400">${empresa.contato}</div>
            </td>
            <td class="py-4 px-6 text-slate-300">${empresa.plano}</td>
            <td class="py-4 px-6 text-slate-300">R$ ${empresa.valor.toFixed(2).replace('.', ',')}</td>
            <td class="py-4 px-6 text-slate-300">${empresa.renovacao}</td>
            <td class="py-4 px-6">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}">${empresa.status}</span>
            </td>
            <td class="py-4 px-6 text-right space-x-2">
                <button onclick="mudarStatus(${empresa.id})" title="Alternar Status" class="text-slate-400 hover:text-indigo-400 transition p-1">
                    <i class="fa-solid fa-rotate"></i>
                </button>
                <button onclick="excluirEmpresa(${empresa.id})" title="Excluir" class="text-slate-400 hover:text-rose-400 transition p-1">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("total-clientes").innerText = empresasZyntra.length;
    document.getElementById("total-pagos").innerText = totalPago;
    document.getElementById("total-pendentes").innerText = totalPendente;
    document.getElementById("total-faturamento").innerText = `R$ ${faturamentoTotal.toFixed(2).replace('.', ',')}`;
}

function mudarStatus(id) {
    const empresa = empresasZyntra.find(e => e.id === id);
    if (empresa) {
        if (empresa.status === "Pago") empresa.status = "Pendente";
        else if (empresa.status === "Pendente") empresa.status = "Vencido";
        else empresa.status = "Pago";
        
        carregarPainel();
    }
}

function excluirEmpresa(id) {
    if (confirm("Tem certeza que deseja remover esta empresa do painel?")) {
        empresasZyntra = empresasZyntra.filter(e => e.id !== id);
        carregarPainel();
    }
}

function adicionarEmpresaModal() {
    const nome = prompt("Nome da Empresa:");
    if (!nome) return;
    const contato = prompt("Nome do Contato:");
    const valorStr = prompt("Valor (ex: 150.00):");
    const valor = parseFloat(valorStr) || 0;
    const renovacao = prompt("Data de Renovação (ex: 30/08/2026):");

    const nova = {
        id: Date.now(),
        nome: nome,
        contato: contato || "Responsável",
        plano: "Profissional",
        valor: valor,
        renovacao: renovacao || "30/08/2026",
        status: "Pendente"
    };

    empresasZyntra.push(nova);
    carregarPainel();
}

window.onload = carregarPainel;
