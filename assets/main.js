const auth = firebase.auth();
const database = firebase.database();

function signUp() {
    const formData = document.querySelector('form');
    formData.addEventListener('submit', event => {
        event.preventDefault();
        const form = new FormData(formData);
        auth.createUserWithEmailAndPassword(
            form.get('email'),
            form.get('password')
        ).then(user => {
            auth.currentUser.displayName = form.get('username');
            auth.currentUser.phoneNumber = form.get('phone');
            auth.currentUser.emailVerified = true;
            location.pathname = "/"
        })
        .catch(error => console.error(error));
    });
}

function LogIn() {
    const formData = document.querySelector('form');
    formData.addEventListener('submit', event => {
        event.preventDefault();
        const form = new FormData("form");
        auth.signInWithEmailAndPassword(
            form.get("email"),
            form.get("password")
        ).then(() => {
            location.pathname = "/"
        }).catch(error => console.error());
    });
}

function signOut() {
    auth.signOut().then(() => {
        location.pathname = '/';
    }).catch(error => console.error(error));
}

function addPoll(){

}

function viewPoll(pid) {
    const poll = database.ref(`users/${auth.currentUser.uid}/${pid}`)
    poll.on('child_added', snapshot => {

    });
}

function showChart(data = null) {

}

function updatePoll(pid = null) {

}

function deletePoll(pid = null) {
    
}

function showLoginModal() {
    
}

function showSignUpModal() {
   
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log(`Service Worker Scope: ${reg.scope}`))
        .catch(error => console.log(error));
}