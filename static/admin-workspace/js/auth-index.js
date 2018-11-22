import '../scss/auth.scss'

document.querySelectorAll('input').forEach((i) => {
    i.addEventListener('keyup', onInputChange);
});

function onInputChange(e) {
    this.className = this.value ? 'not-empty' : '';
    ensureSubmitBtnState();
};

function ensureSubmitBtnState() {
    var isDisabled = !gebId('LoginInput').value || !gebId('PasswordInput').value;
    gebId('SubmitButton')[isDisabled ? 'setAttribute' : 'removeAttribute']('disabled', true);
};

function gebId(id) {
    return document.getElementById(id);
};