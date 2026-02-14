// ============================
// VARIABLES GLOBALES
// ============================
let users = [];
let currentUser = null;

// Plans d'investissement
const plans = [
  {name:"Plan 2500 FCFA", montant:2500, gainJour:699, duree:30},
  {name:"Plan 5000 FCFA", montant:5000, gainJour:1400, duree:30},
  {name:"Plan 10000 FCFA", montant:10000, gainJour:2800, duree:30},
  {name:"Plan 20000 FCFA", montant:20000, gainJour:5600, duree:30},
  {name:"Plan 50000 FCFA", montant:50000, gainJour:14000, duree:30},
  {name:"Plan 100000 FCFA", montant:100000, gainJour:28000, duree:30},
  {name:"Plan 200000 FCFA", montant:200000, gainJour:56000, duree:30},
  {name:"Plan 500000 FCFA", montant:500000, gainJour:140000, duree:30},
  {name:"Plan 750000 FCFA", montant:750000, gainJour:210000, duree:30},
  {name:"Plan 1000000 FCFA", montant:1000000, gainJour:280000, duree:30}
];

// ============================
// FONCTIONS UTILES
// ============================

// Afficher page
function showPage(pageId){
  document.querySelectorAll('section').forEach(sec=>{
    sec.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

// Afficher login
function showLogin(){
  alert("Fonction login à ajouter (ou créer une autre page)");
}

// Mettre le code pays automatiquement
document.getElementById('country').addEventListener('change', function(){
  const val = this.value;
  const codes = {BF:"+226", CI:"+225", SN:"+221", NE:"+227", ML:"+223", BJ:"+229", TG:"+228", GH:"+233", GM:"+220", LR:"+231", SL:"+232"};
  document.getElementById('countryCode').value = codes[val] || "";
});

// ============================
// INSCRIPTION
// ============================
document.getElementById('signupForm').addEventListener('submit', function(e){
  e.preventDefault();
  const user = {
    country: document.getElementById('country').value,
    countryCode: document.getElementById('countryCode').value,
    phone: document.getElementById('phone').value,
    nickname: document.getElementById('nickname').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    balance:1500, // bonus initial
    investments:[],
    referrals:0
  };
  users.push(user);
  currentUser = user;
  alert(`Bonjour ${user.nickname}, votre compte a été créé avec succès !`);
  showPage('home');
  displayPlans();
  updateBalance();
});

// ============================
// PLANS
// ============================
function displayPlans(){
  const container = document.getElementById('plansContainer');
  container.innerHTML = '';
  plans.forEach((plan,i)=>{
    const div = document.createElement('div');
    div.innerHTML = `<span>${plan.name} - ${plan.gainJour} FCFA/jour sur ${plan.duree} jours</span>
                     <button class="button-rectangle" onclick="invest(${i})">Investir</button>`;
    container.appendChild(div);
  });
}

function invest(planIndex){
  const plan = plans[planIndex];
  if(currentUser.balance >= plan.montant){
    currentUser.balance -= plan.montant;
    currentUser.investments.push(plan);
    alert(`Vous avez investi dans ${plan.name}`);
    updateBalance();
    displayInvestments();
  } else {
    alert("Votre solde est insuffisant. Veuillez recharger pour investir.");
  }
}

// ============================
// AFFICHER INVESTISSEMENTS
// ============================
function displayInvestments(){
  const container = document.getElementById('investmentsContainer');
  container.innerHTML = '';
  if(currentUser.investments.length===0){
    container.innerHTML = "<p>Aucun investissement pour l'instant.</p>";
    return;
  }
  currentUser.investments.forEach((plan)=>{
    const div = document.createElement('div');
    div.className = "plan-card";
    div.innerHTML = `<strong>${plan.name}</strong> - ${plan.gainJour} FCFA/jour - Durée: ${plan.duree} jours`;
    container.appendChild(div);
  });
}

// ============================
// MISE À JOUR DU SOLDE
// ============================
function updateBalance(){
  document.getElementById('balance').innerText = currentUser.balance;
}

// ============================
// RECHARGE AVEC OTP
// ============================
let rechargeData = {};

function nextRechargeStep(){
  rechargeData.operator = document.getElementById('operatorSelect').value;
  rechargeData.amount = parseInt(document.getElementById('rechargeAmount').value);
  rechargeData.number = document.getElementById('rechargeNumber').value;

  if(!rechargeData.amount || !rechargeData.number){
    alert("Veuillez remplir tous les champs.");
    return;
  }

  document.getElementById('step1').style.display='none';
  document.getElementById('step2').style.display='block';
  document.getElementById('rechargeInstruction').innerText = `Composez *144*4*6*${rechargeData.amount}# sur votre opérateur ${rechargeData.operator}`;
}

function nextRechargeStep2(){
  document.getElementById('step2').style.display='none';
  document.getElementById('step3').style.display='block';
}

function submitRecharge(){
  const otp = document.getElementById('otpCode').value;
  if(otp.length===0){
    alert("Veuillez saisir le code OTP.");
    return;
  }
  // Ici on simule la validation côté admin
  currentUser.balance += rechargeData.amount;
  alert(`Recharge de ${rechargeData.amount} FCFA validée !`);
  updateBalance();
  document.getElementById('rechargePage').style.display='none';
}

// ============================
// RETRAIT
// ============================
function submitRetrait(){
  const amount = parseInt(document.getElementById('retraitAmount').value);
  if(amount>currentUser.balance){
    alert("Solde insuffisant pour ce retrait.");
    return;
  }
  currentUser.balance -= amount;
  alert(`Retrait de ${amount} FCFA effectué !`);
  updateBalance();
  document.getElementById('retraitPage').style.display='none';
}