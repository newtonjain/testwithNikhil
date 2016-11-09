console.log('browser: count() example TBD');

for (let i = 0; i < 10; i++) {
    console.count();
}

function foo() {
    console.count('foo!');
}

let i = 0;

function mySetTimeout() {
    window.setTimeout(() => {
        if (i < 5) {
            i++;
            foo();
            mySetTimeout();
        }
    }, 20);
}

mySetTimeout();