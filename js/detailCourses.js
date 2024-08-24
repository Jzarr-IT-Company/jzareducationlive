
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cn = urlParams.get('cn');
    updatedLocalstorage(cn);

})


function updatedLocalstorage(cn) {
    // console.log(cn)
    // let courses = JSON.parse(localStorage.getItem(idCookie)) || [];
    // let newCourseTem = JSON.parse(localStorage.getItem("newCoursesTem")) || [];
    // newCourseTem.push(cn)
    // localStorage.setItem(idCookie, JSON.stringify(courses));
    // localStorage.setItem("newCoursesTem", JSON.stringify(newCourseTem));


    try {
        // Retrieve the existing courses from localStorage or initialize to an empty array
        let courses = JSON.parse(localStorage.getItem(idCookie)) || [];
        let newCourseTem = JSON.parse(localStorage.getItem("newCoursesTem")) || [];

        // Check if the course already exists in the array to prevent duplicates
        if (!courses.includes(cn)) {
            // Add the new course to the array
            courses.push(cn);
            newCourseTem.push(cn)
            // Save the updated array back to localStorage
            localStorage.setItem(idCookie, JSON.stringify(courses));
            localStorage.setItem("newCoursesTem", JSON.stringify(newCourseTem));
        } else {
            // Swal.fire({
            //     position: "center",
            //     icon: "warning",
            //     title: "Course already exists!",
            //     showConfirmButton: false,
            //     timer: 1500
            // })
            return
        }
    } catch (error) {
        console.log('Error saving course:', error.message);
    }

}

// const saveCourse = async (courseName) => {
//     try {
//         // Retrieve the existing courses from localStorage or initialize to an empty array
//         let courses = JSON.parse(localStorage.getItem(idCookie)) || [];
//         let newCourseTem = JSON.parse(localStorage.getItem("newCoursesTem")) || [];

//         // Check if the course already exists in the array to prevent duplicates
//         if (!courses.includes(courseName)) {
//             // Add the new course to the array
//             courses.push(courseName);
//             newCourseTem.push(courseName)
//             // Save the updated array back to localStorage
//             localStorage.setItem(idCookie, JSON.stringify(courses));
//             localStorage.setItem("newCoursesTem", JSON.stringify(newCourseTem));
//         } else {
//             // Swal.fire({
//             //     position: "center",
//             //     icon: "warning",
//             //     title: "Course already exists!",
//             //     showConfirmButton: false,
//             //     timer: 1500
//             // })
//             return
//         }
//     } catch (error) {
//         console.log('Error saving course:', error.message);
//     }
// }

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
const token = getCookie('token');
const url = window.location.href;
const urlObj = new URL(url);
const id = urlObj.searchParams.get('cid');
const sid = urlObj.searchParams.get('id');
const cn = urlObj.searchParams.get('cn');
let email;
let phone;
updatedLocalstorage(cn)

document.getElementById('loader').style.display = 'flex';

axios.post('https://main-server-zeta.vercel.app/getCourseById', { id: id })
    .then(res => {
        document.getElementById('loader').style.display = 'none';
        let courses = res.data.data;
        courses.map((data) => {
            document.querySelector("#courseImage").src = data.Courseimage;
            document.querySelector("#description").innerHTML = data.coursedescription;
            document.querySelector("#coursename").innerHTML = data.coursetitle;
        })
    })
    .catch(error => {
        document.getElementById('loader').style.display = 'none';
        console.error('Error fetching data:', error);
    });

const getStudentData = () => {
    axios.get(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`,
        {
            headers: {
                'Authorization': `Bearer ${tokenCookie}`
            }
        }).then((res) => {
            let data = res.data.data;
            data.map((data) => {
                email = data.email;
                phone = data.phone;
            })
        })
}
getStudentData()
document.querySelector("#buyMoreClass").addEventListener('click', () => {
    if (!token) {
        localStorage.setItem("buyMore", true)
        window.location.href = "./signup.html"
    } else {
        window.location.href = "./selecteCourses.html"
    }
})
document.querySelector("#buyCourse").addEventListener('click', async () => {
    if (!token) {
        localStorage.setItem("onlineBuy", true)
        window.location.href = `./signup.html?cn=${cn}`

    } else {
        localStorage.removeItem("paymnetPay")
        let upcourses = JSON.parse(localStorage.getItem(idCookie)) || [];
        axios.post('https://main-server-zeta.vercel.app/courseUpdate', { id: idCookie, courses: upcourses })
            .then(response => {
                document.getElementById('loader').style.display = 'none';
                window.location.href=`./payment.html?ac=${btoa(2700)}&e=${btoa(email)}&p=${btoa(phone)}`
                // window.location.href = `https://payment-gateway-beryl.vercel.app/?ac=2700&e=${email}`
                // window.location.href = `https://payment-gateway-beryl.vercel.app/?ac=${encodeURIComponent("2700")}&e=${encodeURIComponent(email)}&p=${encodeURIComponent(phone)}`;
            })
            .catch(error => {
                document.getElementById('loader').style.display = 'none';
                console.error('Error', error.message);
                Swal.fire({
                    title: 'Error add course. Please try again.',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'bttn'
                    }
                });
            });
    }
})

const paymnetPay = localStorage.getItem('paymnetPay')
const clearCookiesStoreCourses = () => {
    if (!paymnetPay) {
        const allTemData = localStorage.getItem("newCoursesTem")
        let existingData = JSON.parse(localStorage.getItem(idCookie)) || [];
        existingData = existingData.filter(item => !allTemData.includes(item));
        localStorage.setItem(idCookie, JSON.stringify(existingData));
        localStorage.removeItem('newCoursesTem')
        axios.post('https://main-server-zeta.vercel.app/courseUpdate', { id: idCookie, courses: existingData })
            .then(response => {
            })
            .catch(error => {
            });
    }
}
clearCookiesStoreCourses()