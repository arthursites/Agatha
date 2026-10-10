
 // ======================================================
 // CONFIGURAÇÃO
 // ======================================================

const EMAIL_DESTINO = "arthurtrabalhossitesetc@gmail.com";

const URL_FORM = `https://formsubmit.co/ajax/${EMAIL_DESTINO}`;


// ======================================================
// ELEMENTOS
// ======================================================

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const success = document.getElementById("success");
const startBtn = document.getElementById("startBtn");
const quizForm = document.getElementById("quizForm");
const questions = document.querySelectorAll(".question");
const questionNumber = document.getElementById("questionNumber");
const progressBar = document.getElementById("progressBar");

let currentQuestion = 0;


// ======================================================
// INICIAR
// ======================================================

startBtn.addEventListener("click", () => {
    intro.classList.remove("active");
    quiz.classList.add("active");

    currentQuestion = 0;
    updateQuestion();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ======================================================
// ATUALIZAR PERGUNTA
// ======================================================

function updateQuestion() {
    questions.forEach((question, index) => {
        question.classList.toggle(
            "active-question",
            index === currentQuestion
        );
    });

    const total = questions.length;

    questionNumber.textContent =
        `${currentQuestion + 1} de ${total}`;

    const progress = ((currentQuestion + 1) / total) * 100;
    progressBar.style.width = `${progress}%`;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================================
// VALIDAR PERGUNTA ATUAL
// ======================================================

function validateCurrentQuestion() {
    const current = questions[currentQuestion];

    if (!current) return false;

    const fields = current.querySelectorAll(
        "input[required], textarea[required]"
    );

    for (const field of fields) {
        if (field.type === "radio") {
            const radios = current.querySelectorAll(
                `input[name="${field.name}"]`
            );

            if (![...radios].some(radio => radio.checked)) {
                alert("Escolhe uma opção antes de continuar 💗");
                return false;
            }

            continue;
        }

        if (!field.value.trim()) {
            alert("Responde essa pergunta antes de continuar 💗");
            field.focus();
            return false;
        }
    }

    return true;
}


// ======================================================
// PRÓXIMA PERGUNTA
// ======================================================

document.querySelectorAll(".next-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (!validateCurrentQuestion()) return;

        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            updateQuestion();
        }
    });
});


// ======================================================
// VOLTAR
// ======================================================

document.querySelectorAll(".back-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            updateQuestion();
        }
    });
});


// ======================================================
// ENVIAR RESPOSTAS POR E-MAIL
// ======================================================

quizForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateCurrentQuestion()) return;

    const submitButton = quizForm.querySelector(".submit-btn");

    if (!submitButton || submitButton.disabled) return;

    submitButton.disabled = true;
    submitButton.textContent = "Enviando respostas... 💌";

    try {
        // Coleta as respostas preenchidas no formulário.
        const formData = new FormData(quizForm);
        const respostas = Object.fromEntries(formData.entries());

        // Identifica o e-mail recebido.
        respostas._subject = "Respostas do questionário romântico 💗";

        // Envia os dados pela rota AJAX oficial.
        const response = await fetch(URL_FORM, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(respostas)
        });

        // Tenta interpretar a resposta do serviço.
        const data = await response.json();

        console.log("Resposta do FormSubmit:", data);

        // Não considera uma resposta HTTP 200 como
        // confirmação suficiente de que o envio foi aceito.
        const envioConfirmado =
            data.success === true ||
            String(data.success).toLowerCase() === "true";

        if (!response.ok || !envioConfirmado) {
            throw new Error(
                data.message || data.error ||
                `O serviço não confirmou o envio (HTTP ${response.status}).`
            );
        }

        // Só exibe a carta depois da confirmação do serviço.
        quiz.classList.remove("active");
        success.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        console.error("Falha no envio:", error);

        alert(
            "Não foi possível confirmar o envio das respostas. 💗\n\n" +
            "Suas respostas continuam na página. Verifique a conexão " +
            "e tente novamente.\n\n" +
            "Detalhe: " + error.message
        );

        submitButton.disabled = false;
        submitButton.textContent = "Enviar respostas ❤️";
    }
});
