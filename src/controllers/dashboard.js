const user=JSON.parse(sessionStorage.getItem("currentUser"));
const greetingName=document.querySelector("#greetingName");
greetingName.textContent=user.name;
document.getElementById("availableBalance").textContent=user.wallet.balance+" "+user.wallet.currency;
const credits=user.wallet.transactions.filter(t=>t.type==="credit");
const debits=user.wallet.transactions.filter(t=>t.type==="debit");
const sommeCredits=credits.reduce((somme,t)=>somme+t.amount,0);
document.getElementById("monthlyIncome").textContent=sommeCredits+"MAD";
const sommeDebits=debits.reduce((somme,t)=>somme+t.amount,0);
document.getElementById("monthlyExpenses").textContent=sommeDebits+"MAD";
document.getElementById("activeCards").textContent = user.wallet.cards.length;

const errorDiv=document.getElementById("error");

document.getElementById("quickTransfer").addEventListener("click",function () {
    document.getElementById("transfer-section").classList.remove("hidden");
});

const closeBtn=document.getElementById("closeTransferBtn");
closeBtn.addEventListener("click",function () {
    document.getElementById("transfer-section").classList.add("hidden");
});

document.getElementById("cancelTransferBtn").addEventListener("click",function () {
    document.getElementById("transfer-section").classList.add("hidden");
});

const btnTransfer=document.getElementById("submitTransferBtn");
btnTransfer.addEventListener("click",hundlertransfer);

function checkMontant(amount,callback) {
    setTimeout(function(){
        if (!amount || amount<=0) {
            errorDiv.style.color="red";
            errorDiv.textContent="Montant invalide.";
        } 
        else{
            callback();
        }
    },500);
}
function checkSolde(amount,cardNum,callback){
    setTimeout(function(){
        const card=user.wallet.cards.find(c => c.numcards === cardNum);
        if(!card || Number(card.balance) < amount){
            errorDiv.style.color="red";
            errorDiv.textContent="Solde insuffisant";
        }
        else{
            callback(card);
        }
    },500);
}
function checkBeneficiaire(benefId, callback){
    setTimeout(function(){
        if(!benefId){
            errorDiv.style.color="red";
            errorDiv.textContent="Veuillez sélectionner un bénéficiaire";
        }
        else{
            callback();
        }
    },500);
}
function executerTransfert(amount,cardNum,benefId,callback){
    setTimeout(function(){
        const card=user.wallet.cards.find(c => c.numcards === cardNum);
        const beneficiary = database.users.find(u => u.email === benefId);
        const debit = {
            id:String(Date.now()),
            type:"debit",
            amount:amount,
            date:new Date().toLocaleDateString("fr-FR"),
            from:card.numcards,
            to:benefId
        };
        const credit = {
            id:String(Date.now()+1),
            type:"credit",
            amount:amount,
            date:new Date().toLocaleDateString("fr-FR"),
            from:card.numcards,
            to:beneficiary.email
        };
        card.balance=Number(card.balance)-amount;
        user.wallet.balance -= amount;
        beneficiary.wallet.balance += amount;
        user.wallet.transactions.push(debit);
        beneficiary.wallet.transactions.push(credit);
        sessionStorage.setItem("currentUser",JSON.stringify(user));
        callback();
    },500);
}
function hundlertransfer(){
    const amount=parseInt(document.getElementById("amount").value);
    const benefId=document.getElementById("beneficiary").value;
    const cardNum=document.getElementById("sourceCard").value;
    errorDiv.textContent="";
    checkMontant(amount,function(){
        checkSolde(amount,cardNum,function(card){
            checkBeneficiaire(benefId,function(){
                executerTransfert(amount,cardNum,benefId,function(){
                    errorDiv.style.color="green";
                    errorDiv.textContent="Transfert réussi";
                    document.getElementById("availableBalance").textContent=
                    user.wallet.balance+" MAD";
                    document.getElementById("transferForm").reset();
                });
            });
        });
    });
}

