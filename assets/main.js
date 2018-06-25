const auth = firebase.auth();
const database = firebase.database();

function signUp() {
    
}
function signIn() {
    
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log(`Service Worker Scope: ${reg.scope}`))
        .catch(error => console.log(error));
}