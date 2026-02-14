// UTILISATEUR ACTUEL
let currentUser = null;

// =======================
// AFFICHER UNE SECTION
// =======================
function showSection(sectionId) {

    let sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";
}

// =======================
// NAVIGATION INSCRIPTION / LOGIN
// =======================
function showLogin() {
    document.getElementById("signup").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function showSignup() {
    document.getElementById("login").style.display = "none";
    document.getElementById("signup").style.display = "block";
}

// =======================
// INSCRIPTION
// =======================
function register() {

    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;

    if (phone === "" || password === "") {
        alert("Remplis tous les champs");
        return;
    }

    let user = {
        phone: phone,
        password: password,
        balance: 1500
    };

    localStorage.setItem(phone, JSON.stringify(user));

    alert("Inscription réussie !");
    showLogin();
}

// =======================
// CONNEXION
// =======================
function login() {

    let phone = document.getElementById("loginPhone").value;
    let password = document.getElementById("loginPassword").value;

    let user = JSON.parse(localStorage.getItem(phone));

    if (user && user.password === password) {
        currentUser = user;
        document.getElementById("auth").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        updateBalance();
        showSection("home");
    } else {
        alert("Numéro ou mot de passe incorrect");
    }
}

// =======================
// METTRE À JOUR LE SOLDE
// =======================
function updateBalance() {
    document.getElementById("balance").innerText = currentUser.balance + " FCFA";
}

// =======================
// RECHARGE (simulation)
// =======================
function recharge() {

    let amount = parseInt(document.getElementById("rechargeAmount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Montant invalide");
        return;
    }

    currentUser.balance += amount;
    localStorage.setItem(currentUser.phone, JSON.stringify(currentUser));

    updateBalance();
    alert("Recharge réussie !");
}

// =======================
// RETRAIT (simulation)
// =======================
function withdraw() {

    let amount = parseInt(document.getElementById("withdrawAmount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Montant invalide");
        return;
    }

    if (amount > currentUser.balance) {
        alert("Solde insuffisant");
        return;
    }

    currentUser.balance -= amount;
    localStorage.setItem(currentUser.phone, JSON.stringify(currentUser));

    updateBalance();
    alert("Retrait effectué !");
}