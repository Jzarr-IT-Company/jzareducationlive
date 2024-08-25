

const video = document.getElementById('myVideo');

video.controlsList = "nodownload";

video.oncontextmenu = function (event) {
    event.preventDefault();
    return false;
};

video.onmousedown = function (event) {
    if (event.button === 2) {
        event.preventDefault();
        return false;
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    // Function to restore the active link from localStorage on page load
    const restoreActiveLink = () => {
        const activeLinkId = localStorage.getItem('activeLink');
        if (activeLinkId) {
            const activeLink = document.getElementById(activeLinkId);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    };

    // Call the function to restore the active link
    restoreActiveLink();
});

// Function to handle link click and toggle sidebar visibility
function handleLinkClick(link) {
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(l => l.classList.remove('active')); // Remove 'active' class from all links
    link.classList.add('active'); // Add 'active' class to the clicked link
    localStorage.setItem('activeLink', link.id); // Update localStorage with the new active link ID

    // Logic to handle the click event, e.g., closing the sidebar
    toggleSidebar();
}

// Function to toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}





const url = window.location.href;

const urlObj = new URL(url);

const id = urlObj.searchParams.get('cid');
const sid = urlObj.searchParams.get('id');
document.getElementById('loader').style.display = 'flex';

axios.post('https://main-server-zeta.vercel.app/getCourseById', { id: id })
    .then(res => {
        document.getElementById('loader').style.display = 'none';
        if (res.data.status === 200) {
            let courses = res.data.data;

            courses.map(async (data) => {

                if (!sid) {
                    document.querySelector('#myVideo').src = data.coursevideos[0].url;
                    document.querySelector('#courseDescrription').innerHTML = data.coursedescription;
                    document.querySelector("#courseName").innerHTML = data.coursename;
                }

                data.coursevideos.map((video) => {
                    // selectedCourseBar
                    document.querySelector('#selectedCourse').innerHTML += `
                <a href="#" class="text-dark text-decoration-none text-start text-capitalize" id="link-class1"
                onclick="updateUrlAndHighlight('${video._id}', this)">
                <strong>${video.title}</strong></a>`;
                    document.querySelector('#selectedCourseBar').innerHTML += `
                <a href="#" class="text-dark text-decoration-none text-start text-capitalize" id="link-class1"
                onclick="updateUrlAndHighlight('${video._id}', this)">
                <strong>${video.title}</strong></a>`;
                });

                if (sid) {
                    const filteredVideo = data.coursevideos.find(video => video._id === sid);
                    if (filteredVideo) {
                        document.querySelector('#myVideo').src = filteredVideo.url;
                        document.querySelector("#courseName").innerHTML = data.coursename;
                        document.querySelector('#courseDescrription').innerHTML = data.coursedescription;
                    }
                }
            });

        }
    })
    .catch(error => {
        document.getElementById('loader').style.display = 'none';

        console.error('Error fetching data:', error);
    });

function updateUrlAndHighlight(newId, clickedElement) {
    let currentUrl = new URL(window.location.href);

    currentUrl.searchParams.delete('id');
    currentUrl.searchParams.append('id', newId);

    history.pushState(null, '', currentUrl.toString());

    document.querySelectorAll('.text-dark').forEach(link => {
        link.classList.remove('active-link');
    });
    clickedElement.classList.add('active');

    axios.post('https://main-server-zeta.vercel.app/getCourseById', { id: id })
        .then(res => {

            let courses = res.data.data;

            courses.map(async (data) => {
                const filteredVideo = data.coursevideos.find(video => video._id === newId);
                if (filteredVideo) {
                    document.querySelector('#myVideo').src = filteredVideo.url;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const sidebarLinks = document.querySelectorAll('.sidebar a, #selectedCourse a'); // Update selector for dynamic links
    sidebarLinks.forEach(link => link.classList.remove('active'));

    // // Step 3: Add 'active' class to the clicked link
    clickedElement.classList.add('active');

    // // Step 4: Store the active link ID in localStorage
    localStorage.setItem('activeLink', newId);
    window.location.reload()


}

const style = document.createElement('style');
style.innerHTML = `
.active-link {
color: #007bff; /* Example color for the active link */
font-weight: bold;
}
`;


// Restore the active link from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeLinkId = localStorage.getItem('activeLink');
    if (activeLinkId) {
        const activeLink = document.getElementById(activeLinkId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});
document.head.appendChild(style);


