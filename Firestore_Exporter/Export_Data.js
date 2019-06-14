module.exports.exporter = (dbdata, dbref)=>{
  let count = 0;
  dbdata.map(item => {
    let price = item["Price"] ;
    item["Price"] = parseInt(price);
    dbref
      .add(item)
      .then()
      .catch(rej => {
        console.log(rej);
      });
    count++;
  });
  console.log(`${count} will be documents added please wait....`);
}



// (db, collectionPath, batchSize) => {
//     let collectionRef = db.collection(collectionPath);
//     let query = collectionRef.orderBy('__name__').limit(batchSize);
  
//     return new Promise((resolve, reject) => {
//       AddQueryBatch(db, query, batchSize, resolve, reject);
//     });
//   }



//   const AddQueryBatch = (db, query, batchSize, resolve, reject)=>{
//     query
  
//         // Delete documents in a batch
//         let batch = db.batch();
//         snapshot.docs.forEach((doc) => {
//           batch.delete(doc.ref);
//         });
  
//         return batch.commit().then(() => {
//           return snapshot.size;
//         });
//       }).then((numDeleted) => {
//         if (numDeleted === 0) {
//           resolve();
//           return;
//         }
  
//         // Recurse on the next process tick, to avoid
//         // exploding the stack.
//         process.nextTick(() => {
//           AddQueryBatch(db, query, batchSize, resolve, reject);
//         });
//       })
//       .catch(reject);
//   }
  