/*
    when a match is made, there should be a collection that contains two ids. Now, when storing those id in 
    the collection, which id is to be placed at first is decided by this helper function below. We are 
    comparing two strings: id1 and id2.
    Note:   This is not a compulsion process to arrange the ids
*/

const generateId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);

//----------------------------------------------------------OR---------------------------------------------------

// const generateId = (id1, id2) => {
//   if (id1 > id2) {
//     return id1 + id2;
//   } else {
//     return id2 + id1;
//   }
// };

export default generateId;
