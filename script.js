const state = {
    score: 0,
    answers: {},
    lead: { nome: '', cargo: '', condominio: '', whatsapp: '' }
};

function nextStep(stepNumber) {
    // Validação ao sair da Identificação (Passo 1)
    if (stepNumber === 2) {
        const nome = document.getElementById('userName').value;
        const cargo = document.getElementById('userRole').value;
        const condo = document.getElementById('condoName').value;
        const telRaw = document.getElementById('userPhone').value;

        // Limpa o telefone para aceitar apenas números
        const telApenasNumeros = telRaw.replace(/\D/g, '');

        if (!nome || !cargo || !condo || telApenasNumeros.length < 10) {
            alert("⚠️ Por favor, preencha todos os campos corretamente.");
            return;
        }

        // Grava no estado global
        state.lead = { 
            nome: nome, 
            cargo: cargo, 
            condominio: condo, 
            whatsapp: telApenasNumeros 
        };
    }

    const current = document.querySelector('.step:not(.hidden)');
    const next = document.getElementById(`step-${stepNumber}`);

    if (next) {
        current.classList.add('hidden');
        next.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

function handleAnswer(key, value, nextTarget) {
    state.answers[key] = value;
    state.score += value;
    
    if (nextTarget === 'result') {
        processFinalResult();
    } else {
        nextStep(nextTarget);
    }
}

async function processFinalResult() {
    document.querySelector('.step:not(.hidden)').classList.add('hidden');
    document.getElementById('step-loading').classList.remove('hidden');

    // CONECTE SUA API AQUI:
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0h7rmhc-yk79sdXW3MBicsdewKqr2fCIC9ubfE2_W0fuRZ3oHljwWV3CoT9dUe0LP/exec"; 

    try {
        await fetch(WEB_APP_URL, { 
            method: 'POST', 
            mode: 'no-cors', // Importante para evitar erros de política de segurança
            body: JSON.stringify(state) 
        });
        console.log("Dados enviados para o Sheets!");
    } catch (e) { 
        console.error("Erro na integração:", e); 
    }

    setTimeout(renderResult, 2500);
}

function renderResult() {
    const isCritical = state.score < 80;
    const colorClass = isCritical ? 'text-red-500' : 'text-ecomp-cyan';
    const btnColor = isCritical ? 'bg-red-600' : 'bg-ecomp-cyan';
    
    document.getElementById('main-card').innerHTML = `
        <div class="text-center animate-in">
            <h2 class="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-4 italic">Resultado da Auditoria</h2>
            
            <div class="mb-6">
                <div class="text-7xl font-black ${colorClass} tracking-tighter">${state.score}%</div>
                <p class="mt-2 font-bold text-white text-lg italic uppercase tracking-tighter">Eficiência Técnica</p>
                ${isCritical ? '<p class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-widest animate-pulse">⚠️ Atenção: Risco Detectado</p>' : ''}
            </div>

            <div class="bg-ecomp-dark/50 p-5 rounded-2xl mb-6 text-left border border-slate-700">
                <p class="text-ecomp-cyan font-bold text-[10px] uppercase mb-1 leading-none italic">
                    <i class="fa-solid fa-gift mr-1"></i> Bônus Liberado
                </p>
                <p class="text-slate-300 text-[11px] mb-4 italic leading-tight">Manual de Boas Práticas para Síndicos de Natal/RN.</p>
                <a href="SEGCOMP- Guia_Seguranca_Condominial_Segcomp.pdf" download class="block w-full bg-white text-ecomp-dark text-center py-2 rounded-lg font-black text-[10px] uppercase hover:bg-slate-200 transition-colors">
                    Download PDF
                </a>
            </div>

            <div class="space-y-4">
                <a href="https://wa.me/5584996479464?text=Olá! Sou ${state.lead.nome} (${state.lead.cargo}) do condomínio ${state.lead.condominio}. Meu score no diagnóstico foi ${state.score}%. Gostaria de agendar a auditoria técnica presencial." 
                   target="_blank"
                   class="block w-full ${btnColor} text-white font-black py-4 rounded-2xl shadow-lg uppercase text-sm hover:scale-[1.02] transition-all">
                   ${isCritical ? 'Solicitar Auditoria de Urgência' : 'Agendar Visita Técnica'}
                </a>
                
                <p class="text-[9px] text-slate-500 px-4 leading-tight italic uppercase">
                    Aproveite: Devido à alta demanda na Grande Natal, restam poucos horários para auditoria presencial gratuita nesta semana.
                </p>

                <button onclick="location.reload()" class="text-slate-500 uppercase text-[9px] font-bold tracking-widest hover:text-white transition-colors pt-2">
                   <i class="fa-solid fa-rotate-right mr-1"></i> Refazer Diagnóstico
                </button>
            </div>
            
            <p class="mt-6 text-[8px] text-slate-600 uppercase tracking-widest border-t border-slate-800/50 pt-4">Grupo Ecomp • Tecnologia em Segurança </p>
        </div>
    `;

    if (isCritical) {
        document.getElementById('main-card').classList.add('critical-border');
    }
}