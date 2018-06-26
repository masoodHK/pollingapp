const auth = firebase.auth();
const database = firebase.database();

function signUp() {
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    
    if(confirmPassword === password){
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            let userSignedIn = auth.currentUser;
            userSignedIn.updateProfile({
                displayName: username,
                emailVerified: true
            })
            setTimeout(() => {
                location = 'index.html';
            }, 1000)
        }).catch((err) => {
            var errorCode = err.code;
            var errorMessage = err.message;
            if (errorCode === 'auth/weak-password') {
                document.getElementsByClassName("error-message")[1].innerHTML = `<p>The password is too weak.</p>`
            } else {
                document.getElementsByClassName("error-message")[1].innerHTML = `<p>${errorMessage}</p>`
            }
            setTimeout(() =>{
                document.getElementsByClassName("error-message")[1].innerHTML = ""
            },5000)
            console.log(`${err}`)
        });
    }
    return false
}

function logIn() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, password).then(() => {
        setTimeout(() => {
            location = 'index.html';
        }, 1000)
    })
    .catch((err) => {
        var errorCode = err.code;
        var errorMessage = err.message;
        if (errorCode) {
            console.log('Error:' + errorCode);
        } else {
            console.log(errorMessage);
        }
        console.log(`Error: ${err}`)
    });
    return false
}

function signOut() {
    auth.signOut().then(() => {
        setTimeout(() => {
            location = 'index.html';
        }, 1000)
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

function changeState (){
    let nav = $('ul.right.menu');
    let addButton = $('#addPoll');
    auth.onAuthStateChanged(user => {
        if(user){
            nav.html(`
                <li>
                    <a class="ui item">Welcome: ${user.displayName}</a>
                </li>
                <li>
                    <a onclick="signOut()" class="ui item">Sign Out</a>
                </li>
            `);
            addButton.html(`<button class="ui button">Add New Poll</button>`)
            // document.body.onload = showTasks();
            // document.querySelector('main').setAttribute('class', 'display');
        }
    });
}

$(document).ready(() => {
    $('.ui.modal').modal();
})

function showLoginModal() {
    $('.ui.modal#login')
        .modal('show')
    ;
}

$('div.ui.styled.accordion').accordion({
    selector: {
      trigger: '.title'
    }
})

function showSignUpModal() {
    $('.ui.modal#sign-up')
        .modal('show')
    ;
}


if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log(`Service Worker Scope: ${reg.scope}`))
        .catch(error => console.log(error));
}

changeState();

