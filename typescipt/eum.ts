// enum Month {
//     Jan,
//     Feb,
//     Mar,
//     Apr,
//     May,
//     Jun,
//     Jul,
//     Aug,
//     Sep,
//     Oct,
//     Nov,
//     Dec
// };
// // month is number
// function isItSummer(month: Month) {
//     let isSummer: String;
//     switch (month) {
//         case Month.Jun:
//         case Month.Jul:
//         case Month.Aug:
//            month;
//             break;
//         default:
//          month;
//             break;
//     }
//     return month;
// }
// console.log(isItSummer(Month.Jun));

function fn(a: string | number) {
    if (typeof a === "string") {
      return true;
    } else if (typeof a === "number") {
      return false;
    }   
  }

  console.log(fn('hello'))