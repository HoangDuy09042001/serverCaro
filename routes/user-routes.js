const express = require('express');
const multer = require('multer')
const {addUser, 
       getAllUsers, 
       getUser,
       updateUser,
       deleteUser,
       addHistory,
       getRaking,
       addImage,
       getUserFace
      } = require('../controllers/userController');
const Multer = multer({
    storage: multer.memoryStorage(),
    limits: 1024 * 1024,
})
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload', upload.single('file'), (req, res) => {
    console.log("File upload API")
});
router.post('/user', addUser);
router.post('/user/picture',Multer.single("image") ,addImage);
router.get('/history', getRaking);
router.post('/user/history', addHistory);
router.get('/users', getAllUsers);
router.get('/user/:userName/:password', getUser);
router.get('/face/:id', getUserFace);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);


module.exports = {
    routes: router
}