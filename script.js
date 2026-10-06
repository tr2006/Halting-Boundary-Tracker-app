// ==========================================
// HALTING BOUNDARY TRACKER
// ==========================================


// ==========================================
// HALTING MACHINE
// ==========================================

const haltingTransitions = {

    "q0,1": {
        write: "1",
        move: "R",
        next: "q1"
    },

    "q1,1": {
        write: "1",
        move: "R",
        next: "q2"
    },

    "q2,1": {
        write: "1",
        move: "R",
        next: "HALT"
    },

    "q0,_": {
        write: "_",
        move: "R",
        next: "HALT"
    },

    "q1,_": {
        write: "_",
        move: "R",
        next: "HALT"
    },

    "q2,_": {
        write: "_",
        move: "R",
        next: "HALT"
    }
};


// ==========================================
// NON-HALTING MACHINE
// ==========================================

const loopTransitions = {

    "q0,1": {
        write: "1",
        move: "R",
        next: "q0"
    },

    "q0,0": {
        write: "0",
        move: "R",
        next: "q0"
    },

    "q0,_": {
        write: "_",
        move: "R",
        next: "q0"
    }
};


// ==========================================
// RUN SIMULATION
// ==========================================

function runSimulation() {

    const input =
        document.getElementById("tapeInput").value;


    const K =
        parseInt(
            document.getElementById("stepLimit").value
        );


    const machine =
        document.getElementById("machineSelect").value;


    // ------------------------------
    // INPUT VALIDATION
    // ------------------------------

    if (input.length === 0) {

        alert("Please enter a tape.");

        return;
    }


    if (isNaN(K) || K <= 0) {

        alert("Please enter a valid K value.");

        return;
    }


    // ------------------------------
    // SELECT MACHINE
    // ------------------------------

    let transitions;

    if (machine === "halt") {

        transitions = haltingTransitions;

    } else {

        transitions = loopTransitions;
    }


    // ------------------------------
    // CREATE TAPE
    // ------------------------------

    let tape = input.split("");


    // Add blank cells

    for (let i = 0; i < K + 10; i++) {

        tape.push("_");
    }


    // ------------------------------
    // INITIAL STATE
    // ------------------------------

    let head = 0;

    let state = "q0";

    let steps = 0;


    // ------------------------------
    // RESET HISTORY
    // ------------------------------

    document.getElementById("history").innerHTML = "";


    // ------------------------------
    // INITIAL UI
    // ------------------------------

    document.getElementById("status").textContent =
        "RUNNING";


    document.getElementById("currentState").textContent =
        state;


    document.getElementById("stepCount").textContent =
        steps;


    document.getElementById("boundaryCurrent").textContent =
        steps;


    document.getElementById("boundaryLimit").textContent =
        K;


    document.getElementById("progressBar").style.width =
        "0%";


    document.getElementById("result").textContent =
        "Simulation is running...";


    displayTape(tape, head);


    // ==========================================
    // EXECUTION LOOP
    // ==========================================

    while (
        steps < K &&
        state !== "HALT"
    ) {


        // ------------------------------
        // READ TAPE
        // ------------------------------

        const readSymbol =
            tape[head] || "_";


        // ------------------------------
        // FIND TRANSITION
        // ------------------------------

        const key =
            state + "," + readSymbol;


        const transition =
            transitions[key];


        // ------------------------------
        // NO TRANSITION
        // ------------------------------

        if (!transition) {

            state = "HALT";

            break;
        }


        // ------------------------------
        // WRITE
        // ------------------------------

        tape[head] =
            transition.write;


        // ------------------------------
        // MOVE
        // ------------------------------

        if (transition.move === "R") {

            head++;

        } else if (
            transition.move === "L"
        ) {

            head--;

            if (head < 0) {

                tape.unshift("_");

                head = 0;
            }
        }


        // ------------------------------
        // COUNT STEP
        // ------------------------------

        steps++;


        // ------------------------------
        // HISTORY
        // ------------------------------

        addHistoryRow(

            steps,

            state,

            readSymbol,

            transition.write,

            transition.move,

            transition.next

        );


        // ------------------------------
        // UPDATE STATE
        // ------------------------------

        state =
            transition.next;


        // ------------------------------
        // UPDATE UI
        // ------------------------------

        document.getElementById(
            "currentState"
        ).textContent = state;


        document.getElementById(
            "stepCount"
        ).textContent = steps;


        // ------------------------------
        // UPDATE BOUNDARY
        // ------------------------------

        document.getElementById(
            "boundaryCurrent"
        ).textContent = steps;


        const progress =
            Math.min(
                (steps / K) * 100,
                100
            );


        document.getElementById(
            "progressBar"
        ).style.width =
            progress + "%";


        // ------------------------------
        // UPDATE TAPE
        // ------------------------------

        displayTape(
            tape,
            head
        );
    }


    // ==========================================
    // FINAL RESULT
    // ==========================================

    if (state === "HALT") {

        document.getElementById(
            "status"
        ).textContent =
            "HALTED";


        document.getElementById(
            "result"
        ).textContent =

            "HALTED — Machine stopped after " +
            steps +
            " step(s).";


    } else {

        document.getElementById(
            "status"
        ).textContent =
            "TIMEOUT";


        document.getElementById(
            "result"
        ).textContent =

            "TIMEOUT — Boundary K = " +
            K +
            " reached without halting.";
    }
}


// ==========================================
// DISPLAY TAPE
// ==========================================

function displayTape(
    tape,
    head
) {

    const tapeElement =
        document.getElementById("tape");


    tapeElement.innerHTML = "";


    tape.forEach(
        (symbol, index) => {

            const cell =
                document.createElement("div");


            cell.className =
                "tape-cell";


            if (index === head) {

                cell.classList.add(
                    "head-cell"
                );
            }


            cell.textContent =
                symbol === "_"
                    ? "□"
                    : symbol;


            tapeElement.appendChild(
                cell
            );
        }
    );
}


// ==========================================
// ADD HISTORY ROW
// ==========================================

function addHistoryRow(
    step,
    state,
    read,
    write,
    move,
    nextState
) {

    const table =
        document.getElementById(
            "history"
        );


    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>${step}</td>

        <td>${state}</td>

        <td>${read}</td>

        <td>${write}</td>

        <td>${move}</td>

        <td>${nextState}</td>

    `;


    table.appendChild(row);
}


// ==========================================
// RESET
// ==========================================

function resetSimulation() {

    document.getElementById(
        "status"
    ).textContent =
        "READY";


    document.getElementById(
        "currentState"
    ).textContent =
        "q0";


    document.getElementById(
        "stepCount"
    ).textContent =
        "0";


    document.getElementById(
        "boundaryCurrent"
    ).textContent =
        "0";


    document.getElementById(
        "boundaryLimit"
    ).textContent =
        "10";


    document.getElementById(
        "progressBar"
    ).style.width =
        "0%";


    document.getElementById(
        "result"
    ).textContent =
        "Waiting for simulation...";


    document.getElementById(
        "history"
    ).innerHTML = "";


    displayTape(
        ["1", "0", "1", "0", "1", "_"],
        0
    );
}


// ==========================================
// BUTTON EVENTS
// ==========================================

document.getElementById(
    "runButton"
).addEventListener(
    "click",
    runSimulation
);


document.getElementById(
    "resetButton"
).addEventListener(
    "click",
    resetSimulation
);
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service Worker registered"))
            .catch(error => console.log("Service Worker error:", error));
    });
}