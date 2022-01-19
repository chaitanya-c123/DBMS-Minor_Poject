function myFunction() {
    var x = document.getElementById("editForm");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  document.getElementById("myBtn").onclick = function() {myFun()};

/* myFun toggles between adding and removing the show class, which is used to hide and show the dropdown content */
function myFun() {
  document.getElementById("myDropdown").classList.toggle("show");
}