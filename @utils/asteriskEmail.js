"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asteriskMail = void 0;
function asteriskMail(email) {
    let firstTwoCharacter = email.slice(0, 2);
    let charactersToBeAsterisked = email.slice(2, email.indexOf("@"));
    let lastCharactersAfterAsterisks = email.slice(email.indexOf("@"));
    let charactersToBeAsteriskedArray = charactersToBeAsterisked.split("");
    let processQueue = [];
    for (let i = 0; i < charactersToBeAsteriskedArray.length; i++) {
        let asteriskedCharacters = charactersToBeAsteriskedArray[i].replace(charactersToBeAsteriskedArray[i], "*");
        processQueue.push(asteriskedCharacters);
    }
    // join function
    function joinMailBack(...characters) {
        return characters.reduce((a, c) => {
            return a + c;
        });
    }
    ;
    let fullMail = joinMailBack(firstTwoCharacter, ...processQueue, lastCharactersAfterAsterisks);
    return fullMail;
}
exports.asteriskMail = asteriskMail;
;
