console.group('browser:  Group A')
console.log('browser:  I\'m message 1 in group 1');
console.group('browser:  Group B');
console.log('browser:  I\'m  message 1/2 in group 2');
console.log('browser:  I\'m  message 2/2 in group 2');
console.groupEnd()
console.log('browser:  I\'m message 2 in group 1');
console.groupCollapsed('browser:  Group C');
console.log('browser:  I\'m message 1/2 in (collapsed) group 3');
console.log('browser:  I\'m message 2/2 in (collapsed) group 3');
console.groupEnd();
console.log('browser:  I\'m message 3 in group 1');
console.groupEnd();