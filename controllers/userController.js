'use strict';

const firebase = require('../db');
const database = firebase.database()
const User = require('../models/user');
const History = require('../models/history');
const firestore = firebase.firestore();

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('users').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addImage = async (req, res, next) => {
    try {
        const data = req.body;
        console.log('data', data)
        await firestore.collection('picture').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const addHistory = async (req, res, next) => {
    try {
        const data = req.body;
        console.log('add history', data)
        await firestore.collection('history').doc().set(data);
        res.send('Record history saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUser = async (req, res, next) => {
    try {
        const userName = req.params.userName
        const password = req.params.password
        const usersRef = firestore.collection('users')
        const snapshot = await usersRef.where('userName', '==', userName).where('password', '==', password).get()
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            res.send({...doc.data(), idNode: doc.id});
          });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserFace = async (req, res, next) => {
    try {
        console.log('getUserFace')
        const idFace = req.params.id
        console.log('idFace', idFace)
        const usersRef = firestore.collection('users')
        const snapshot = await usersRef.where('id', '==', idFace).get()
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            res.send({...doc.data(), idNode: doc.id});
          });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await firestore.collection('users').orderBy('score', 'desc');
        const data = await users.get();
        const usersArray = [];
        if(data.empty) {
            res.status(404).send('No User record found');
        }else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().id,
                    doc.data().userName,
                    doc.data().password,
                    doc.data().score,
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getRaking = async (req, res, next) => {
    try {
        const users = await firestore.collection('history');
        const data = await users.get();
        const usersArray = [];
        if(data.empty) {
            res.status(404).send('No User record found');
        }else {
            data.forEach(doc => {
                const user = new History(
                    doc.id,
                    doc.data().author,
                    doc.data().idLose,
                    doc.data().idWin,
                    doc.data().loseScore,
                    doc.data().room,
                    doc.data().time,
                    doc.data().winGame,
                    doc.data().winScore,
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user =  await firestore.collection('users').doc(id);
        const doc = await user.get();
        let scoretmp = 0
        if (!doc.exists) {
            console.log('No such document!');
          } else {
            if(data.plus!==undefined) {
                if(data.plus===true) {
                    scoretmp = doc.data().score+1 
                }
                else {
                    scoretmp = doc.data().score-1
                } 
                await user.update({
                    "score": scoretmp
                });
            }
            
            if(data.imgUrl!==undefined) 
            await user.update({
                "imgUrl": data.imgUrl,
                "userName": data.userName,
                "age": data.age,
                "hobby": data.hobby
            });

          }
        res.send('User record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('users').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    addHistory,
    getRaking,
    addImage,
    getUserFace
}