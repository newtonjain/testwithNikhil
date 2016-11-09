console.log('browser: console.dir statement');
console.dir({a:  'this is an object sent through browser\'s console.dir', b: { c: 'this is a sub-object' }});
console.log('browser: console.dirxml statement');
console.dirxml({a:  'this is an object sent through browser\'s console.dirxml', b: { c: 'this is a sub-object' }});
console.dirxml('hello %s', 'this is a format string', {a: 'b'});
console.dir(document.body);
console.dirxml(document.body);
