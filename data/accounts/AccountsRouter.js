const express = require('express');

const db = require('../dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    // select * from accounts
    db
        .select('*')
        .from('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Error getting the accounts'})
        })
});

router.get('/:id', (req, res) => {
    // select * from accounts where id = req.params.id
    db
        .select('*')
        .from('accounts')
        .where({ id: req.params.id })
        .first() // equivalent to accounts[0]
        .then(account => {
            res.status(200).json(account);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Error getting the account'})
        })
});

router.post('/', (req, res) => {
    // insert into () values ()
    const postData = req.body;

//     // please validate postData before calling the database
//     // knex.insert(postData).into('posts')
//     // second argument "id") will show a warning on console when use SQLite
//     // it's there for the future (when we move to MySQL or Postgres)
    db('accounts')
        .insert(postData, "id")
        .then(ids => {
            // returns an array of one element, the id of the last record inserted
            const id = ids[0];

        return db("accounts")
                .select('id', 'name', 'budget')
                .where({ id })
                .first()
                .then(account => {
                    res.status(201).json(account);
                })  
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Error adding the account'})
        })

});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    // validate the data or the changes
    db("accounts")
        .where({ id }) // ALWAYS FILTER ON UPDATE AND DELETE
        .update(changes)
        .then(count => {
            if(count > 0) {
                res.status(200).json({ message: `${count} records(s) added`});
            } else {
               res.status(404).json({ message: "Record not found"}) 
            }   
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Error updating the account'})
        })

});

router.delete('/:id', (req, res) => {
    db("accounts")   
        .where({ id: req.params.id }) // ALWAYS FILTER ON UPDATE AND DELETE
        .del()
        .then(count => {
            res.status(200).json({ message: `${count} records(s) added`});
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Error deleting the account'})
        })    
});










module.exports = router;