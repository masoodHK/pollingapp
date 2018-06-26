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
    const question = document.getElementById('question').value;
    const options = document.getElementsByName('options');
    let poll = {
        question,
        author: auth.currentUser.displayName,
        option: {}
    }
    for(let i = 0; i < 4; i++) {
        poll.option[options[i].value] = 0;
    }
    database.ref(`users/${auth.currentUser.uid}/polls`).push().set(poll);
    database.ref(`polls`).push().set(poll);
    location.reload();
    return false;
}

function viewPolls() {
    const accordion = $('.ui.styled.accordion');
    database.ref(`polls`).on('child_added', snapshot => {
        var poll = renderPoll(snapshot.val(), snapshot.key);
        accordion.append(poll);
    });
}

function renderPoll(data, key) {
    return `
    <div class="title">
        <i class="dropdown icon"></i>
        ${data.question}
        <span style="margin-left:auto">
            <button class="ui button" onClick="deletePoll('${key}')">Delete Poll</button>
        </span>
    </div>
    <div class="content">
        Made by: ${data.author}
    </div>
    `
}

function showChart(data = null) {

}

function deletePoll(pid = null) {
    database.ref(`users/${auth.currentUser.uid}/polls/${pid}`).remove();
    database.ref(`polls/${pid}`).remove();
    location.reload();
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
            addButton.html(`<button class="ui button" onClick="showAddPollModal()">Add New Poll</button>`)
            document.body.onload = viewPolls();
            // document.querySelector('main').setAttribute('class', 'display');
        }
    });
}

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

function showAddPollModal() {
    $('.ui.modal#addNewPoll')
        .modal('show')
    ;
}


if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log(`Service Worker Scope: ${reg.scope}`))
        .catch(error => console.log(error));
}

changeState();

