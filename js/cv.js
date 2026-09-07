'use strict';

const printButton = document.getElementById('printCv');

if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
}
