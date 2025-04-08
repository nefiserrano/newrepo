document.querySelectorAll(".pswBtn").forEach((pswBtn) => {
    pswBtn.addEventListener("click", function () {
        const pswInput = document.getElementById(pswBtn.dataset.target);
        const type = pswInput.getAttribute("type");
        if (type === "password") {
            pswInput.setAttribute("type", "text");
            pswBtn.innerHTML = "Hide Password";
        } else {
            pswInput.setAttribute("type", "password");
            pswBtn.innerHTML = "Show Password";
        }
    });
});