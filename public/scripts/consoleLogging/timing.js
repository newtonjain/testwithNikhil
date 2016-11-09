console.log('browser: starting timer %s', 'browser-T1');
console.time('browser-T1');
window.setTimeout(() => {
    console.log('browser: about to call timeEnd() for timer %s', 'browser-T1');
    console.timeEnd('browser-T1');
    console.log('browser: ended timer %s', 'browser-T1');
}, 200);