// ============================================================
// geracaoPDF.js — Geração do PDF com accordion de competências
// ============================================================

function gerarPDF() {

    if (document.getElementById("nome").value.trim() === "") {
        alert("Informe o nome do colaborador.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const nome        = document.getElementById("nome").value;
    const dataHora    = document.getElementById("dataHora").value;
    const media       = document.getElementById("media").innerText;
    const resultado   = document.getElementById("resultado").innerText;
    const observacoes = document.getElementById("observacoes").value || "Nenhuma observação.";
    const feedback    = (window.feedbackIATexto || "").trim();

    let y = 20;

    // --------------------------------------------------------
    // HELPER — nova página se necessário
    // --------------------------------------------------------

    function novaLinha(altura) {
        if (y + altura > 275) { pdf.addPage(); y = 20; }
    }

    // --------------------------------------------------------
    // CABEÇALHO
    // --------------------------------------------------------

    pdf.setFillColor(26, 31, 94);          // azul-escuro
    pdf.rect(0, 0, 210, 25, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("AVALIAÇÃO DE COMPETÊNCIAS", 105, 16, { align: "center" });
    pdf.setTextColor(0, 0, 0);

    y = 38;

    // --------------------------------------------------------
    // DADOS DO COLABORADOR
    // --------------------------------------------------------

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");   pdf.text("Colaborador:", 20, y);
    pdf.setFont("helvetica", "normal"); pdf.text(nome, 55, y);
    y += 7;
    pdf.setFont("helvetica", "bold");   pdf.text("Data/Hora:", 20, y);
    pdf.setFont("helvetica", "normal"); pdf.text(dataHora, 55, y);
    y += 7;
    pdf.setFont("helvetica", "bold");   pdf.text("Média Final:", 20, y);
    pdf.setFont("helvetica", "normal"); pdf.text(`${media}/10 — ${resultado}`, 55, y);
    y += 12;

    // --------------------------------------------------------
    // TABELA DE COMPETÊNCIAS (nome + nota + comentário)
    // --------------------------------------------------------

    // Cabeçalho da tabela
    pdf.setFillColor(74, 86, 245);      // azul-medio
    pdf.rect(20, y, 170, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("COMPETÊNCIA", 23, y + 5.5);
    pdf.text("NOTA", 152, y + 5.5);
    pdf.setTextColor(0, 0, 0);
    y += 8;

    // Linhas de competências
    competencias.forEach((c, i) => {

        const bgColor = i % 2 === 0 ? [245, 246, 255] : [255, 255, 255];
        pdf.setFillColor(...bgColor);
        pdf.rect(20, y, 170, 8, "F");
        pdf.setDrawColor(220, 221, 240);
        pdf.rect(20, y, 170, 8);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(30, 31, 59);
        pdf.text(c.nome, 23, y + 5.5);
        pdf.text(c.nota > 0 ? `${c.nota}/10` : "—", 152, y + 5.5);
        y += 8;

        // Comentário do gestor (se houver)
        if (c.comentario && c.comentario.trim() !== "") {
            novaLinha(14);
            pdf.setFillColor(237, 233, 254);    // lilas-claro
            pdf.rect(20, y, 170, 1, "F");
            y += 3;
            pdf.setFont("helvetica", "italic");
            pdf.setFontSize(8);
            pdf.setTextColor(100, 60, 180);
            const linhasComentario = pdf.splitTextToSize(`  Comentário: ${c.comentario}`, 162);
            novaLinha(linhasComentario.length * 4.5 + 3);
            pdf.text(linhasComentario, 24, y);
            y += linhasComentario.length * 4.5 + 3;
            pdf.setTextColor(0, 0, 0);
        }
    });

    y += 10;

    // --------------------------------------------------------
    // OBSERVAÇÕES DO GESTOR
    // --------------------------------------------------------

    novaLinha(16);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(26, 31, 94);
    pdf.text("Observações do Gestor", 20, y);
    pdf.setDrawColor(74, 86, 245);
    pdf.line(20, y + 2, 190, y + 2);
    pdf.setTextColor(0, 0, 0);
    y += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const linhasObs = pdf.splitTextToSize(observacoes, 170);
    novaLinha(linhasObs.length * 5.5);
    pdf.text(linhasObs, 20, y);
    y += linhasObs.length * 5.5 + 12;

    // --------------------------------------------------------
    // FEEDBACK DA IA
    // --------------------------------------------------------

    novaLinha(16);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(124, 58, 237);     // roxo
    pdf.text("Feedback da IA", 20, y);
    pdf.setDrawColor(124, 58, 237);
    pdf.line(20, y + 2, 190, y + 2);
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(180);
    y += 10;

    if (feedback !== "") {

        feedback.split("\n").map(l => l.trim()).forEach(linha => {

            if (linha === "") return;

            if (linha.startsWith("## ")) {
                novaLinha(10);
                y += 2;
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(10);
                pdf.setTextColor(74, 86, 245);
                pdf.text(linha.replace("## ", "").toUpperCase(), 20, y);
                pdf.setTextColor(0, 0, 0);
                y += 6;
                return;
            }

            const marcador = linha.startsWith("- ") || linha.startsWith("* ");
            const texto    = marcador ? linha.replace(/^[-*]\s/, "") : linha;
            const recuo    = marcador ? 26 : 20;
            const largura  = marcador ? 160 : 170;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9.5);

            const quebradas = pdf.splitTextToSize(
                (marcador ? "• " : "") + texto, largura
            );

            novaLinha(quebradas.length * 5.5);
            pdf.text(quebradas, recuo, y);
            y += quebradas.length * 5.5 + 1.5;
        });

    } else {

        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.setTextColor(160, 160, 160);
        pdf.text("Feedback da IA não gerado para esta avaliação.", 20, y);
        pdf.setTextColor(0, 0, 0);
        y += 10;
    }

    // --------------------------------------------------------
    // ASSINATURA + RODAPÉ + LOGO
    // --------------------------------------------------------

    novaLinha(30);
    y += 10;
    pdf.setDrawColor(0);
    pdf.line(120, y, 190, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Assinatura do Gestor/Líder", 135, y + 5);

    pdf.setFontSize(7.5);
    pdf.setTextColor(140);
    pdf.text(
        "Documento gerado automaticamente pelo AvaliaRH - Desenvolvido por Falcão.",
        105, 290, { align: "center" }
    );

    // Logo (opcional)
    const img = new Image();
    img.src = "frontend/assets/img/logo-sem-fundo.png";

    const salvar = () =>
        pdf.save("Avaliacao_" + nome.replace(/\s/g, "_") + ".pdf");

    img.onload = () => {
        pdf.addImage(img, "PNG", 170, 275, 30, 18);
        salvar();
    };

    img.onerror = () => {
        console.warn("Logo não encontrada. Gerando PDF sem imagem.");
        salvar();
    };
}
