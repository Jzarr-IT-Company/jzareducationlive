
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const tokenCookie = getCookie('token');
const idCookie = getCookie('id');
const isCourse = getCookie('isCourse');
const getCourses = JSON.parse(localStorage.getItem("courses"));

// const isAvtiveToggel = async () => {
//     let active;
//     axios.get(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`,
//         {
//             headers: {
//                 'Authorization': `Bearer ${tokenCookie}`
//             }
//         }).then((res) => {
//             res.data.data.map((data) => {
//                 active = data.isActive
//                 console.log(data.isActive)
//                 if(data.isActive){

//                     localStorage.removeItem("manuallyPaymentBtn")
//                 }
//             })
//         })
//     console.log(active)
// }
// isAvtiveToggel()



const isActiveToggle = async () => {
    let active;

    try {
        const res = await axios.get(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`, {
            headers: {
                'Authorization': `Bearer ${tokenCookie}`
            }
        });

        res.data.data.forEach((data) => {
            active = data.isActive;
            console.log(data.courses)
            localStorage.setItem(idCookie,JSON.stringify(data.courses))
            console.log(data);
            if (data.isActive) {
                // Remove the item from localStorage
                localStorage.removeItem("paymnetPay");
                window.location.reload();
                
                // Make the API call if isActive is true
                axios.post('http://localhost:8888/updateIsNotActive', {
                    id: idCookie
                }, {
                    headers: {
                        'Authorization': `Bearer ${tokenCookie}`
                    }
                }).then((response) => {
                    localStorage.removeItem('paymnetPay')
                    console.log('API call was successful', response.data);
                }).catch((error) => {
                    console.error('API call failed', error);
                });
            }
        });

        console.log(active);
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
};

isActiveToggle();



const getData = async () => {
    document.getElementById('loader').style.display = 'flex';

    try {
        const nemailElement = document.querySelector("#nemail");
        const myemail = document.querySelector("#myemail");
        const myname = document.querySelector("#nname");
        const myImageElement = document.querySelector("#myImage");
        const myProfileImage = document.querySelector("#myProfileImage");
        const response = await axios.get(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`,
            {
                headers: {
                    'Authorization': `Bearer ${tokenCookie}`
                }
            });
        if (response.data.status === 200) {
            // isActive

            let getData = await response.data.data;
            getData.map((data) => {
                getcourses(data._id, data.courses)
                console.log(data)

                if (nemailElement && myemail) {
                    nemailElement.innerHTML = data.email;
                    myemail.innerHTML = data.email;
                } else {
                    console.error('Element with ID #nemail not found.');
                }
                if (myname) {
                    myname.innerHTML = data.name
                }
                if (myProfileImage && myImageElement && data.profileImage) {
                    myImageElement.src = data.profileImage;
                    myProfileImage.src = data.profileImage;
                } else if (!myImageElement) {
                    console.error('Element with ID #myImage not found.');
                }
            })
        }
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
}
getData()

let courseNotFound = document.querySelector("#courseNotFound");
async function getcourses(id, name) {

    if (id) {
        axios.post('https://main-server-zeta.vercel.app/selectedGetCourses', {
            coursename: name
        },
            {
                headers: {
                    'Authorization': `Bearer ${tokenCookie}`
                }
            })
            .then(async (response) => {
                document.getElementById('loader').style.display = 'none';
                if (response.status === 200) {
                    let getCourses = await response.data.data;
                    let showBuyCourses = document.querySelector('#showBuyCourses');
                    getCourses.map((data) => {
                        const truncatedDescription = data.coursedescription.substring(0, 50) + '...';
                        showBuyCourses.innerHTML += `
                        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <div class="card">
                                <img src="${data.Courseimage}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title text-capitalize">${data.coursename}</h5>
                                    <p class="card-text">${truncatedDescription}</p>
                                    <a href="./showcourse.html?cid=${data._id}" class="text-success fw-semibold" style="color: #36b913;">view courses</a>
                                </div>
                            </div>
                        </div>
                    `;
                    })

                } else {
                    courseNotFound.innerHTML = `Your selected courses will appear here!`;
                }
            })
            .catch(error => {
                console.error('Error fetching course data:', error.message);
            });
    }
}
getcourses()
// const paymnetPay = localStorage.getItem('localPaymentBtn')
// const clearCookiesStoreCourses = () => {
//     if (!paymnetPay) {
//         const allTemData = localStorage.getItem("newCoursesTem")
//         let existingData = JSON.parse(localStorage.getItem(idCookie)) || [];
//         if(existingData){
//             existingData = existingData.filter(item => !allTemData.includes(item));
//         }else{
//             console.log("ERROR FORM GETSTUDENT ")
//             return;
//         }
//         localStorage.setItem(idCookie, JSON.stringify(existingData));
//         localStorage.removeItem('newCoursesTem')
//         axios.post('https://main-server-zeta.vercel.app/courseUpdate', { id: idCookie, courses: existingData })
//             .then(response => {
//             })
//             .catch(error => {
//                 console.error('Error', error.message);
//             });
//     }
// }
// 
const manuallyPaymentBtn = localStorage.getItem('paymnetPay')

if (manuallyPaymentBtn) {
    document.querySelector("#alert").innerHTML = `
     <div class="alert alert-info" role="alert">
            The course will be available on this dashboard soon after payment verification. Please wait and return to this dashboard!
          </div>
    `
}


// clearCookiesStoreCourses()

