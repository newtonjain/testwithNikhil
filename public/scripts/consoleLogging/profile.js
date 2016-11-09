console.log('browser: starting profile %s', 'browser: profile');
console.profile('browser: profile');
window.setTimeout(() => {
    console.log('browser: about to call profileEnd() for timer %s', 'browser: profile');
    for (var i = 0; i < 20; i++) {
        console.log('browser: Log message %i');
    }
    console.profileEnd('bbrowser: profile');
    console.log('browser: ended profile %s', 'browser: profile');
}, 200);