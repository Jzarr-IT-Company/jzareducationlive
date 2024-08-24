document.querySelector("#successBtn").addEventListener('click', () => {
    localStorage.setItem("paymnetPay", true)
    const maxAge = 20 * 365 * 24 * 60 * 60;
    document.cookie = `isCourse=${true}; path=/; max-age=${maxAge}; Secure; SameSite=Strict`;
    localStorage.removeItem('onlineBuy')
    localStorage.removeItem('buyMore')
    localStorage.removeItem('newCoursesTem')
    localStorage.removeItem('manuallyPaymentBtn')
    localStorage.removeItem('localPaymentBtn')
    window.location.href = "./dashboard.html"
})

