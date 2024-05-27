// interface BusinessPartner {
//     name: string;
//     credit: number;
// }

// interface Identity {
//     id: number;
//     name: string;
// }

// interface Contact {
//     email: string;
//     phone: string;
// }

// type Employee = Identity & Contact;

// let e: Employee = {
//     id: 100,
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '(408)-897-5684'
// };

// console.log(e)


let a: string ="heelo";
let b: number = <number><unknown>a;
console.log(b)
