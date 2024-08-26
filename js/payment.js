function checkPaymentMethod() {
    const bank = document.querySelector('#bank').checked;
    const others = document.querySelector('#others').checked;

    if (!bank && !others) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Please select a payment method before proceeding!",
            showConfirmButton: false,
            timer: 1500
        })

        return false;
    }
    return true;
}
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
let id;
// axios(`https://main-server-zeta.vercel.app/getStudentData/${idCookie}`,
//     {
//         headers: {
//             'Authorization': `Bearer ${tokenCookie}`
//         }
//     }).then((res)=>{
//         console.log(res.data.data)
//         res.data.data.map((data)=>{
//             console.log(data._id)
//         })
//     })
// URL ke query parameters ko get karne ke liye window.location.search ka use karein
const queryString = window.location.search;

// URLSearchParams object banayein query string se
const urlParam = new URLSearchParams(queryString);

// Har ek parameter ko get karne ke liye get() method ka use karein
const ac = urlParam.get('ac'); // 'ac' parameter ko get karein
const e = urlParam.get('e');   // 'e' parameter ko get karein
const p = urlParam.get('p');   // 'p' parameter ko get karein
const c = urlParam.get('cns');


// Kyunki 'ac' parameter base64 encoded hai, hum isko decode karte hain
const decodedAc = atob(ac);
const decodedE = atob(e);
const decodedP = atob(p);
const decodedc = atob(c);
console.log(decodedc)
const fileInput = document.querySelector("#file");
const imagePreview = document.querySelector("#imagePreview");



let image;

fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };

        // "If you're facing any issues with the payment, please try clearing your browser's cache and attempt the payment again."

        reader.readAsDataURL(imageFile);
        let loadingPercentage = 0;

        const formData = new FormData();
        formData.append('file', imageFile);

        axios.post('https://images-apis-cklz.vercel.app/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                // Calculate the upload progress as a percentage
                loadingPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload progress: ${loadingPercentage}%`);

                // You can update your UI here to show the loading percentage
                document.getElementById('progress').innerText = `${loadingPercentage}%`;
            }
        })
            .then(response => {
                console.log(response.data.url)
                image = response.data.url;
                // Set the loading percentage to 100% when upload is complete
                loadingPercentage = 100;
                document.getElementById('progress').innerText = `${loadingPercentage}%`;
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    } else {
        console.log('No file selected.');
    }
});


const useramount = decodedAc ? decodedAc : 2700;

document.querySelector("#totalFee").innerHTML = useramount;
const transactionsId = document.querySelector("#transactionID");
const accountName = document.querySelector("#accountName");
document.querySelector('#uploadBtn').addEventListener('click', async function () {

    const allTemData = localStorage.getItem("newCoursesTem")
    console.log(allTemData)
    deleteFromLocalStorage(allTemData);

    // Check if the image variable is defined
    // Show the loader while the request is being processed
    document.getElementById('loader').style.display = 'flex';
    if (image) {
        console.log(image); // Log the image URL or data for debugging

        // Make the POST request using axios
        axios.post('https://main-server-zeta.vercel.app/addPaymentDetail', {
            image: image,
            email: decodedE,
            phone: decodedP,
            amount: useramount,
            transactionsId: transactionsId.value, // Ensure transactionsId is a DOM element with a value
            accountName: accountName.value, // Ensure accountName is a DOM element with a value
            coursesname: decodedc,
            id: idCookie
        }).then((res) => {
            // deleteFromLocalStorage(allTemData);
            // Hide the loader once the request is complete
            document.getElementById('loader').style.display = 'none';

            // Check the response status and display a success message
            console.log(res.data.status); // Log the response status for debugging
            Swal.fire({
                position: "center",
                icon: "success",
                title: "TRANSACTION SUCCESSFULLY",
                showConfirmButton: false,
                timer: 1500
            }).then((result) => {
                // Redirect to the success page if the user acknowledges the message
                if (result) {
                    localStorage.setItem("paymnetPay", true)
                    window.location.href = "./dashboard.html";
                    // window.location.href = "./verification.html";
                }
            });
        }).catch((error) => {
            // Handle any errors that occur during the request
            console.error("Error during POST request:", error);
            document.getElementById('loader').style.display = 'none';
            Swal.fire({
                position: "center",
                icon: "error",
                title: "TRANSACTION FAILED",
                text: "An error occurred while processing your request.",
                showConfirmButton: true
            });
        });
    } else {
        // Handle the case where the image is not defined
        document.getElementById('loader').style.display = 'none';
        console.warn("No image provided.");
        Swal.fire({
            position: "center",
            icon: "error",
            title: "No image provided.",
            text: "Please try again",
            showConfirmButton: true
        });
    }

});
// Function to delete a value from LocalStorage based on a match
const deleteFromLocalStorage = (valuesToRemove) => {


    const allTemData = localStorage.getItem("newCoursesTem");
        // Check if allTemData is not null and parse it if not
        const allTemDataParsed = allTemData ? JSON.parse(allTemData) : [];

        let existingData = JSON.parse(localStorage.getItem(idCookie)) || [];
        if (existingData) {
            existingData = existingData.filter(item => !allTemDataParsed.includes(item));
        } else {
            return;
        }

    console.log(existingData);
    // // Save the updated data back to LocalStorage
    localStorage.setItem(idCookie, JSON.stringify(existingData));
    localStorage.removeItem('localPaymentBtn')
    // let emptyCourses = [];
    axios.post('https://main-server-zeta.vercel.app/courseUpdate', { id: idCookie, courses: existingData })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.error('Error', error.message);
        });
    console.log("Updated LocalStorage data:", existingData);
};

// document.querySelector('#localPaymentBtn').addEventListener('click', function () {
//     window.location.href = `https://payment-gateway-beryl.vercel.app/?ac=${encodeURIComponent(useramount)}&e=${encodeURIComponent(decodedE)}&p=${encodeURIComponent(decodedP)}`;
//     localStorage.setItem("localPaymentBtn", true);
// });