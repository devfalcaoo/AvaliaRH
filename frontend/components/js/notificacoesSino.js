const atualizacoes = [
    ["🚀", "Agora é possível redefinir a senha!", "Esqueceu a senha? Clique aqui para redefinir e recupere via e-mail.","09/09/2026"],
    ["🚀", "Atualização do sistema", "Novas competências, criação da aba de login e criação de novo usuário, lançamento do Dashboard e lista de colaboradores", "04/09/2026"],
    ["🚀", "Nova versão disponível", "Guia para cada competência e espaço para comentários individuais em cada competência, sininho de notificação de atualizações e layout do PDF muito mais agradável visualmente.", "13/08/2026"],
    ["✨", "Novo layout!", "Novas cores, logo, fonte e design do PDF.", "11/08/2026"],
    ["🐛", "Correções", "Alguns problemas do sistema foram corrigidos.", "10/08/2026"]
];

const lista = document.getElementById("notificacoes");

if (lista) {
    lista.innerHTML = atualizacoes.map(n => `
        <div class="notificacao-item p-3 border-bottom">
            <div class="d-flex gap-2">
                <span class="fs-5">${n[0]}</span>

                <div>
                    <strong>${n[1]}</strong>

                    <div class="small text-muted">
                        ${n[2]}
                    </div>

                    <small class="text-secondary">
                        ${n[3]}
                    </small>
                </div>
            </div>
        </div>
    `).join("");
}