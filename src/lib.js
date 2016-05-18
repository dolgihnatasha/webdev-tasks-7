function checkLocalStorage() {
    try {
        localStorage.setItem('key', 'value');
        localStorage.removeItem('key');
        return true;
    } catch (error) {
        return false;
    }
}

function hasStoredData() {
    return !!localStorage.getItem('peppa');
}

function notify(title, message) {
    console.log('notify');
    var notif = new Notification(title, {body: message});
    notif.onclick = () => {window.focus();}
}

Object.assign(module.exports, {notify, hasStoredData, checkLocalStorage});
