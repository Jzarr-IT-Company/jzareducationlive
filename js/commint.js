

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

let stuname;
let stuemail;
let stuphone;
let stuprofileImage;

axios.get(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`,
    {
        headers: {
            'Authorization': `Bearer ${tokenCookie}`
        }
    }).then((res) => {
        let data = res.data.data;
        data.map((items) => {
            stuname = items.name;
            stuemail = items.email;
            stuphone = items.phone;
            stuprofileImage = items.profileImage;
        })
    })
// name, email, phone, image, commint
document.querySelector("#sendCommint").addEventListener("click", () => {
    let commint = document.querySelector("#commint")

    axios.post(`http://localhost:8888/addCommint`,
        {
            name: stuname,
            email: stuemail,
            phone: stuphone,
            image: stuprofileImage,
            commint: commint.value
        },
        {
            headers: {
                'Authorization': `Bearer ${tokenCookie}`
            }
        }).then((res) => {
            console.log(res)
        })

})