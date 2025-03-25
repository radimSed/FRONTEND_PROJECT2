const pwdInput1 = document.getElementById('password1') as HTMLInputElement;
const pwdInput2 = document.getElementById('password2') as HTMLInputElement;

const checkPswd = () => {
    if(pwdInput1.value.length === 0 && pwdInput2.value.length === 0){
        pwdInput1.style.borderColor = 'white';
        pwdInput2.style.borderColor = 'white';
    } else if(pwdInput1.value === pwdInput2.value){
        pwdInput1.style.borderColor = 'green';
        pwdInput2.style.borderColor = 'green';
    } else {
        pwdInput1.style.borderColor = 'red';
        pwdInput2.style.borderColor = 'red';
    }
}

pwdInput1.addEventListener('keyup', checkPswd);
pwdInput2.addEventListener('keyup', checkPswd);