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
        option: {},
        results: {}
    }

    for(let i = 0; i < 4; i++) {
        poll.option[`option${i + 1}`] = options[i].value;
        poll.results[`option${i + 1}`] = 0;
    }
    database.ref(`users/${auth.currentUser.uid}/polls`).push().set(poll);
    database.ref(`polls`).push().set(poll);
    location.reload();
    return false;
}

function viewPolls(user = null) {
    const accordion = $('.ui.styled.accordion');
    let poll
    database.ref(`polls`).on('child_added', snapshot => {
        if(user){
            poll = renderPoll(snapshot.val(), snapshot.key, user);
        }
        else {
            poll = renderPoll(snapshot.val(), snapshot.key);
        }
        accordion.append(poll);
    });
}

function renderPoll(data, key, user = null) {
    let pollOptions = ``
    for(let i = 0; i < 4; i++) {
        pollOptions += `
            <label for="${i}">${data.option[`option${i + 1}`]}</label>
            <input type="radio" class="pollOption" name="${i}">
            <br>
        `
    }
    if(user) {
        return `
            <div class="title">
                <i class="dropdown icon"></i>
                <h4>
                    ${data.question}
                    <br>                
                    <small>Made by: ${data.author}</small>
                </h4>
                <span style="margin-left:auto">
                    <button class="ui button" onClick="deletePoll('${key}')">Delete Poll</button>
                </span>
            </div>
            <div class="content">
                <div class="result">
                    ${pollOptions}
                </div>
            </div>
        `
    }
    else {
        return `
            <div class="title">
                <i class="dropdown icon"></i>
                <h4>
                    ${data.question}
                    <br>                
                    <small>Made by: ${data.author}</small>
                </h4>
            </div>
            <div class="content">
                <div class="result">
                    ${pollOptions}
                </div>
            </div>
        `
    }
}

function showResult() {

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
            document.body.onload = viewPolls(user);
        }
        else {
            document.body.onload = viewPolls();
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
