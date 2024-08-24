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
// URL ke query parameters ko get karne ke liye window.location.search ka use karein
const queryString = window.location.search;

// URLSearchParams object banayein query string se
const urlParam = new URLSearchParams(queryString);

// Har ek parameter ko get karne ke liye get() method ka use karein
const ac = urlParam.get('ac'); // 'ac' parameter ko get karein
const e = urlParam.get('e');   // 'e' parameter ko get karein
const p = urlParam.get('p');   // 'p' parameter ko get karein

// Kyunki 'ac' parameter base64 encoded hai, hum isko decode karte hain
const decodedAc = atob(ac);
const decodedE = atob(e);
const decodedP = atob(p);
const fileInput = document.querySelector("#file");
const imagePreview = document.querySelector("#imagePreview");

fileInput.addEventListener("change", function () {
    const imageFile = fileInput.files[0]; // Get the selected file

    if (imageFile) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result; // Set the preview image source
            imagePreview.style.display = 'block'; // Display the image
        };

        reader.readAsDataURL(imageFile); // Convert the file to a data URL
    }
});


const useramount = decodedAc ? decodedAc : 2700;
document.querySelector("#totalFee").innerHTML = useramount;
document.querySelector('#uploadBtn').addEventListener('click', function () {
    document.getElementById('loader').style.display = 'flex';
    const fileInput = document.querySelector("#file");
    const transactionsId = document.querySelector("#transactionID");
    const accountName = document.querySelector("#accountName");
    const files = fileInput.files;
    if (files.length > 0) {
        const imageFile = files[0];
        const formData = new FormData();
        formData.append('transactionImage', imageFile);
        formData.append('transactionsId', transactionsId);
        formData.append('accountName', accountName);
        formData.append('useramount', useramount);
        axios.post('http://localhost:8085/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                document.getElementById('loader').style.display = 'none';

                console.log('Response from server:', response.data);
                if (response.data.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "TRANSACTION SUCCESS FULLY",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((result) => {
                        if (result) {
                            window.location.href = "./success.html"
                        }
                    })
                }
            })
            .catch(error => {
                document.getElementById('loader').style.display = 'none';
                console.log(error.response.status === 400)
                if (error === 400) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Transaction receipt failed.",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((result) => {
                        if (result) {
                        }
                    })
                } else if (error === 404) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Transaction receipt failed.",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((result) => {
                        if (result) {
                        }
                    })
                }
                else {
                    Swal.fire({
                        position: "center",
                        icon: "warning",
                        title: "Please send your transaction recipt on whatsapp to verification. This course is temporary allowed",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((result) => {
                        if (result) {
                            
                            // window.location.href = './success.html'
                        }
                    })
                }
                // // switch (error.response.status) {
                //     case 400:
                //         document.getElementById('loader').style.display = 'none';
                //         Swal.fire({
                //             position: "center",
                //             icon: "error",
                //             title: "Transaction receipt failed.",
                //             showConfirmButton: false,
                //             timer: 1500
                //         }).then((result) => {
                //             if (result) {
                //             }
                //         })
                //         break;
                //     case 404:
                //         document.getElementById('loader').style.display = 'none';
                //         Swal.fire({
                //             position: "center",
                //             icon: "error",
                //             title: "Transaction receipt not found.",
                //             showConfirmButton: false,
                //             timer: 1500
                //         }).then((result) => {
                //             if (result) {
                //             }
                //         })
                //         break;
                //     default:
                //         document.getElementById('loader').style.display = 'none';
                //         Swal.fire({
                //             position: "center",
                //             icon: "warning",
                //             title: "Please send your transaction recipt on whatsapp to verification. This course is temporary allowed",
                //             showConfirmButton: false,
                //             timer: 1500
                //         }).then((result) => {
                //             if (result) {
                //                 window.location.href = './success.html'
                //             }
                //         })
                //         break;
                // }
            });
    } else {
        document.getElementById('loader').style.display = 'none';
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "No file selected.",
            showConfirmButton: false,
            timer: 1500
        })
        console.log('No file selected.');
    }
    localStorage.setItem("manuallyPaymentBtn", true);
});


document.querySelector('#localPaymentBtn').addEventListener('click', function () {
    window.location.href = `https://payment-gateway-beryl.vercel.app/?ac=${encodeURIComponent(useramount)}&e=${encodeURIComponent(decodedE)}&p=${encodeURIComponent(decodedP)}`;
    localStorage.setItem("localPaymentBtn", true);
});