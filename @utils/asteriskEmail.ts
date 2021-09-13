export function asteriskMail(email:string) {
    let firstTwoCharacter = email.slice(0,2);

    let charactersToBeAsterisked = email.slice(2, email.indexOf("@"));

    let lastCharactersAfterAsterisks = email.slice(email.indexOf("@"));

    let charactersToBeAsteriskedArray = charactersToBeAsterisked.split("");

    let processQueue:string[] = [];

    for(let i = 0; i < charactersToBeAsteriskedArray.length; i++) {
        let asteriskedCharacters = charactersToBeAsteriskedArray[i].replace(charactersToBeAsteriskedArray[i], "*");
        processQueue.push(asteriskedCharacters);
    }

    // join function

    function joinMailBack(...characters:string[]) {
        return characters.reduce((a,c) => {
            return a + c;
        });
    };

    let fullMail = joinMailBack(firstTwoCharacter,...processQueue,lastCharactersAfterAsterisks);

    return fullMail;
};