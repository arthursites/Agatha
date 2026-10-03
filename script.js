// ======================================================
// CONFIGURAÇÃO
// ======================================================

// COLOQUE SEU E-MAIL AQUI
const EMAIL_DESTINO = "mariacardoso3334@gmail.com";


// ======================================================
// ELEMENTOS
// ======================================================

const intro =
    document.getElementById("intro");

const quiz =
    document.getElementById("quiz");

const success =
    document.getElementById("success");

const startBtn =
    document.getElementById("startBtn");

const quizForm =
    document.getElementById("quizForm");

const questions =
    document.querySelectorAll(".question");

const questionNumber =
    document.getElementById("questionNumber");

const progressBar =
    document.getElementById("progressBar");


// Pergunta atual
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


    const total =
        questions.length;


    questionNumber.textContent =
        `${currentQuestion + 1} de ${total}`;


    const progress =
        ((currentQuestion + 1) / total) * 100;


    progressBar.style.width =
        `${progress}%`;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================================
// VALIDAR PERGUNTA
// ======================================================

function validateCurrentQuestion() {

    const current =
        questions[currentQuestion];


    const fields =
        current.querySelectorAll(
            "input[required], textarea[required]"
        );


    for (const field of fields) {

        // Radio
        if (field.type === "radio") {

            const radios =
                current.querySelectorAll(
                    `input[name="${field.name}"]`
                );


            const checked =
                [...radios].some(
                    radio => radio.checked
                );


            if (!checked) {

                alert(
                    "Escolhe uma opção antes de continuar 💗"
                );

                return false;
            }


            continue;
        }


        // Texto
        if (!field.value.trim()) {

            alert(
                "Responde essa pergunta antes de continuar 💗"
            );

            field.focus();

            return false;
        }

    }


    return true;
}


// ======================================================
// PRÓXIMA PERGUNTA
// ======================================================

document
    .querySelectorAll(".next-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!validateCurrentQuestion()) {
                    return;
                }


                if (
                    currentQuestion <
                    questions.length - 1
                ) {

                    currentQuestion++;

                    updateQuestion();

                }

            }
        );

    });


// ======================================================
// VOLTAR
// ======================================================

document
    .querySelectorAll(".back-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (currentQuestion > 0) {

                    currentQuestion--;

                    updateQuestion();

                }

            }
        );

    });


// ======================================================
// ENVIAR
// ======================================================

quizForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!validateCurrentQuestion()) {
            return;
        }


        const submitButton =
            document.querySelector(
                ".submit-btn"
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "Enviando... 💌";


        const formData =
            new FormData(quizForm);


        const url =
            `https://formsubmit.co/${EMAIL_DESTINO}`;


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",

                        headers: {
                            "Accept":
                                "application/json"
                        },

                        body:
                            formData
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Erro ao enviar respostas"
                );

            }


            // Esconde o questionário
            quiz.classList.remove(
                "active"
            );


            // Mostra a carta
            success.classList.add(
                "active"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(error);


            alert(
                "Não consegui enviar as respostas. " +
                "Verifique sua conexão e tente novamente. 💗"
            );


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Enviar respostas ❤️";

        }

    }
);
