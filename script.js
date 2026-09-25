// ======================================================
// COLOQUE SEU E-MAIL AQUI
// ======================================================

const EMAIL_DESTINO = "arthurtrabalhossitesetc@gmail.com";


// ======================================================
// CONFIGURAÇÃO DO QUESTIONÁRIO
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

    const progress =
        ((currentQuestion + 1) / total) * 100;

    progressBar.style.width = `${progress}%`;

}


// ======================================================
// BOTÃO PRÓXIMA
// ======================================================

document.querySelectorAll(".next-btn").forEach(button => {

    button.addEventListener("click", () => {

        const current = questions[currentQuestion];

        const fields = current.querySelectorAll(
            "input[required], textarea[required]"
        );

        let valid = true;

        fields.forEach(field => {

            if (field.type === "radio") {

                const radios = current.querySelectorAll(
                    `input[name="${field.name}"]`
                );

                const checked = [...radios].some(
                    radio => radio.checked
                );

                if (!checked) {
                    valid = false;
                }

            } else if (!field.value.trim()) {

                valid = false;

            }

        });

        if (!valid) {

            alert("Responde essa pergunta antes de continuar 💗");
            return;

        }

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;

            updateQuestion();

        }

    });

});


// ======================================================
// BOTÃO VOLTAR
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
// ENVIO
// ======================================================

quizForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitButton =
        document.querySelector(".submit-btn");

    submitButton.disabled = true;
    submitButton.textContent = "Enviando... 💌";


    // Cria os dados do formulário
    const formData = new FormData(quizForm);

    // Endereço do serviço de envio
    const url =
        `https://formsubmit.co/${EMAIL_DESTINO}`;


    try {

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Accept": "application/json"
            },

            body: formData

        });


        if (!response.ok) {

            throw new Error("Erro ao enviar");

        }


        // Esconde o questionário
        quiz.classList.remove("active");

        // Mostra a tela final
        success.classList.add("active");

        // Volta para o topo
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        alert(
            "Ops! Não consegui enviar as respostas. " +
            "Verifique sua conexão e tente novamente. 💗"
        );

        submitButton.disabled = false;
        submitButton.textContent = "Enviar respostas ❤️";

    }

});
