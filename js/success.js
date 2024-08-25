
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}
const idCookie = getCookie('id');
const isCourse = getCookie('isCourse');
const tokenCookie = getCookie('token');

axios.get(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`,
    {
        headers: {
            'Authorization': `Bearer ${tokenCookie}`
        }
    }).then((res)=>{
        console.log(res)
    })
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

