const fs = require('fs');
const MarkovChain = require('markovchain');
const tumblr = require('tumblr.js');
const secrets = require('./secrets.js');

// TODO: figure this out
const BLOG_NAME = 'blogName';

const sleep = time => new Promise(r => setTimeout(r, time));

const client = tumblr.createClient(secrets);

(async () => {
    const myImmortalChain = await (async () => {
        const text = await fs.promises.readFile('./MyImmortal.txt', 'utf-8');
        return new MarkovChain(text);
    })();
    
    function makeSentence(start, maxLength) {
        return myImmortalChain
            .start(start)
            .end(maxLength)
            .process();
    }
    
    const generateBodyParagraph = makeSentence.bind(
        undefined,
        wordList => {
            const arr = Object.keys(wordList)
                .filter(word => /^[^a-z]/u.test(word) && !word.startsWith('AN'));
            return arr[Math.floor(Math.random() * arr.length)];
        }
    );
    
    const generateAuthorsNotes = makeSentence.bind(
        undefined,
        () => Math.random() < 3/55 ? 'AN/' : 'AN:',
        61
    );
    
    function generateTags() {
        const rgx = /[",#]/gu;
        const arr = [];
        for (let i = 0; i < Math.floor(Math.random() * 6); ++i) {
            const base = makeSentence(
                wordList => {
                    const arr = Object.keys(wordList)
                        .filter(word => !rgx.test(word));
                    return arr[Math.floor(Math.random() * arr.length)];
                },
                2
            );
            arr.push(base.replaceAll(rgx, ''));
        }
        return arr;
    }

    while (true) {
        const content = [];
        for (let i = 0; i < 1 + Math.floor(3 * Math.random()); ++i) {
            content.push({
                type: 'text',
                text: generateBodyParagraph(),
            });
        }

        if (Math.random() < 0.5) {
            content.push({
                type: 'text',
                text: generateAuthorsNotes(),
            });
        }

        try {
            await client.createPost(
                BLOG_NAME,
                {
                    tags: generateTags(),
                    content,
                }
            );
        } catch (error) {
            console.error(error);
        }

        // sleep for a random amount between 1 and 12 hours
        const duration = 3600000 * (1 + 11 * Math.random());
        await sleep(duration);
    }
})();
