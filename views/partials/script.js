const dropdownBtn=document.querySelector(".dropdown__button");
const dropdownMenu = document.querySelector(".dropdown__menu");
dropdownBtn.addEventListener("click",()=>{
  dropdownMenu.classList.toggle("hide");

});