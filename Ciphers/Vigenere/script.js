let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let input1 = document.getElementsByTagName("textarea")[0];
let input3 = document.getElementsByTagName("textarea")[1];
let input2 = document.getElementsByTagName("input")[0];
let id = null
let plaintext, keyword;

const tr = document.querySelectorAll('table tr')
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const verifPlaintext = /^[a-z\s]+$/i
const verifKeyword = /^[a-z]+$/i

input1.value = ""
input2.value = ""
input3.value = ""

input1.addEventListener("input", (e) => {
    restart()
    if (verifPlaintext.test(e.target.value)) {
        plaintext = e.target.value;
        input1.classList.remove("warning")
        input1.classList.add('good')
    }
    else {
        input1.classList.add("warning")
        input1.classList.remove('good')
        plaintext = undefined
    }
})

input2.addEventListener("input", (e) => {
    restart()
    if (verifKeyword.test(e.target.value)) {
        keyword = e.target.value;
        input2.classList.remove("warning")
        input2.classList.add('good')
    }
    else {
        input2.classList.add("warning")
        input2.classList.remove('good')
        keyword = undefined
    }
})


function restart() {
    input3.value = ""
    for (let i = 1; i < tr.length; i++) {
        if (i == 2) continue
        let td = tr[i].querySelectorAll('td')
        for (let j = 0; j < td.length; j++) {
            td[j].classList.remove('select')
            td[j].classList.remove('select1')
            td[j].style.transitionDelay = "0s"
            td[j].style.color = "#67c401"
        }
    }
}

btn1.addEventListener('click', () => {
    if ((plaintext !== undefined) && (keyword !== undefined)) {
        presentationText(false, plaintext)
        presentationCle()
        let cipher = vigenereEncrypt(plaintext, keyword)
        delay(cipher)
    }

})

function delay(cipher) {
    let s = 0;
    id = setInterval(() => {
        if (s == cipher.length) {
            clearInterval(id)
        } else {
            console.log(cipher[s])
            input3.value += cipher[s]
            s++;
        }
    }, (s + 1 / 2) * 1000);
}


btn2.addEventListener('click', () => {
    if ((plaintext !== undefined) && (keyword !== undefined)) {
        presentationCle()
        let decipher = vigenereDecrypt(plaintext,keyword)
        presentationText(true, decipher)
        delay(decipher)
    }

})

function get_p(c) {
    c = c.toUpperCase();
    for (let i = 0; i < 26; i++) {
        if (c == alphabet[i]) {
            return i;
        }
    }
}


// Vigenere Cipher encryption and decryption in JavaScript (using alphabet array)

function vigenereEncrypt(plainText, key) {
    // Define the alphabet array
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Convert plaintext and key to uppercase
    plainText = plainText.toUpperCase();
    key = key.toUpperCase();

    var cipherText = "";
    var keyIndex = 0;

    // Loop through the plaintext and encrypt each character
    for (var i = 0; i < plainText.length; i++) {
        var plainIndex = alphabet.indexOf(plainText[i]);

        // If the character is not in the alphabet, just add it to the cipher text
        if (plainIndex === -1) {
            cipherText += plainText[i];
        } else {
            var keyIndexMod = keyIndex % key.length;
            var keyIndexChar = key[keyIndexMod];
            var keyIndexAlphabet = alphabet.indexOf(keyIndexChar);
            var cipherIndex = (plainIndex + keyIndexAlphabet) % 26;
            var cipherChar = alphabet[cipherIndex];
            cipherText += cipherChar;
            presentation(i + 1, keyIndexAlphabet, plainIndex)
            keyIndex++;
        }

    }

    return cipherText;
}

function vigenereDecrypt(cipherText, key) {
    // Define the alphabet array
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Convert ciphertext and key to uppercase
    cipherText = cipherText.toUpperCase();
    key = key.toUpperCase();

    var plainText = "";
    var keyIndex = 0;

    // Loop through the ciphertext and decrypt each character
    for (var i = 0; i < cipherText.length; i++) {
        var cipherIndex = alphabet.indexOf(cipherText[i]);

        // If the character is not in the alphabet, just add it to the plain text
        if (cipherIndex === -1) {
            plainText += cipherText[i];
        } else {
            var keyIndexMod = keyIndex % key.length;
            var keyIndexChar = key[keyIndexMod];
            var keyIndexAlphabet = alphabet.indexOf(keyIndexChar);
            var plainIndex = (cipherIndex - keyIndexAlphabet + 26) % 26;
            var plainChar = alphabet[plainIndex];
            presentationTable(keyIndexAlphabet, cipherText[i])
            plainText += plainChar;
            keyIndex++;
        }
    }

    return plainText;
}



function presentation(s, row, col) {
    for (let i = 3; i < tr.length; i++) {
        let td = tr[i].querySelectorAll('td')
        for (let j = 1; j < td.length; j++) {
            if (td[j].attributes[0].textContent == `cell-${row}-${col}`) {
                td[j].style.color = 'black'
                td[j].classList.add("select")
                if (s != NaN) td[j].style.transitionDelay = `${s / 2}s`
            }
        }
    }

}

function presentationCle() {
    for (i = 0; i < keyword.length; i++) {
        pos = get_p(keyword[i])
        for (j = 3; j < 26; j++) {
            if (tr[j].querySelectorAll('td')[0].attributes[1].textContent == `cell-${pos}-a`) {
                tr[j].querySelectorAll('td')[0].style.color = 'black';
                tr[j].querySelectorAll('td')[0].classList.add('select1');
            }
        }
    }
}

function presentationText(delay, plaintext) {
    let k=1;
    for (i = 0; i < plaintext.length; i++) {
        if (plaintext[i] == ' ') {
            continue
        } else {
            pos = get_p(plaintext[i])
            for (j = 0; j < 26; j++) {
                if (tr[1].querySelectorAll('td')[j].attributes[0].textContent == `cell-a-${pos}`) {
                    tr[1].querySelectorAll('td')[j].style.color = 'black';
                    tr[1].querySelectorAll('td')[j].classList.add('select1');
                    if (delay == true) tr[1].querySelectorAll('td')[j].style.transitionDelay = `${k/2}s`
                }
            }
        }
        k++

    }
}

function presentationTable(keyIndex, cipher) {
    let td = tr[keyIndex+3].querySelectorAll('td')
    for (let i = 1; i < td.length; i++) {
        if (td[i].textContent == cipher) {
            td[i].style.color = 'black';
            td[i].classList.add('select');
        }
    }
}

function organizeTable() {
    const td1 = tr[1].querySelectorAll('td')
    for (let i = 0; i < td1.length; i++) {
        td1[i].setAttribute("id", `cell-a-${i}`)
    }

    for (let i = 3; i < 26; i++) {
        tr[i].querySelectorAll('td')[0].setAttribute("id", `cell-${i - 3}-a`)
    }

    for (let i = 3; i < tr.length; i++) {
        let row = i - 3;
        let td = tr[i].querySelectorAll('td')
        for (let j = 1; j < td.length; j++) {
            let col = j - 1;
            td[j].setAttribute("id", `cell-${row}-${col}`)
        }
    }
}

organizeTable()













