const btnLogin=document.querySelector("#Loginbtn");
btnLogin.addEventListener("click",function hundelLogin(){
    btnLogin.textContent="Loading";
    setTimeout(()=>{
        document.location="/src/view/login.html";
    },1000);
})