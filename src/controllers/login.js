import finduserbymail from "../models/database.js";
const mail=document.querySelector("#mail");
const pass=document.querySelector("#password");
const btnSubmit=document.querySelector("#submitbtn");
btnSubmit.addEventListener("click",hundlerSubmit);
function hundlerSubmit(){
    const email=mail.value;
    const password=pass.value;
    if(!email || !password){
        alert("Il faut remplir les champs !");
    }
    else{
        btnSubmit.textContent="Checking";
        setTimeout(()=>{
            const user=finduserbymail(email,password);
            if(user){
                sessionStorage.setItem("currentUser",JSON.stringify(user));
                document.location="../view/dashboard.html";
            }
            else{
                alert("Email ou password incorrect !");
                btnSubmit.textContent="Se connecter";
            }
        },2000);
    }
}