const express = require('express');
const router = express.Router();
const User = require('../models/user');

// router.get('/:id', async (req, res) => {
//   const userId = req.params.id;
//   const user = await User.findById(userId);

//   res.render('user/home.ejs', {user});
// })

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.render('user/home.ejs', { user });
});


router.get('/:id/stamps/new', async (req, res) => {
  const userId = req.params.id;

  res.render('stamp/new.ejs', {userId});
})

router.get('/:id/stamps/:stampId', async (req, res) => {
  const userId = req.params.id;
  const stampId = req.params.stampId;

  const user = await User.findById(userId);
  const stamp = user.album.id(stampId);

  res.render('stamp/show.ejs', {stamp, userId});
})

router.get('/:id/stamps/:stampId/edit', async (req, res) => {
  const userId = req.params.id;
  const stampId = req.params.stampId;

  const user = await User.findById(userId);
  const stamp = user.album.id(stampId);

  res.render('stamp/edit.ejs', {stamp, userId});
})


// // my profile 
// router.get('/:id', async (req, res) => {
//   const userId = req.params.id;
//   const user = await User.findById(userId);
//   res.render('user/home.ejs', { user });
// });

router.post('/:id/stamps', async (req, res) => {
  const userId = req.params.id;
  const name = req.body.name;
  const quantity = req.body.quantity;

  const user = await User.findById(userId);
  user.album.push({name, quantity});

  await user.save();

  res.redirect(`/users/${userId}`)
})

router.put('/:id/stamps/:stampId', async (req, res) => {
  const userId = req.params.id;
  const stampId = req.params.stampId;
  const newName = req.body.name;
  const newQuantity = req.body.quantity;

  const user = await User.findById(userId);
  const stamp = user.album.id(stampId);

  stamp.name = newName
  stamp.quantity = newQuantity;

  await user.save();

  res.redirect(`/users/${userId}/stamps/${stampId}`);
})

router.delete('/:id/stamps/:stampId', async (req, res) => {
  const userId = req.params.id;
  const stampId = req.params.stampId;
  
  const user = await User.findById(userId);

  user.album.pull({_id: stampId})

  await user.save();

  res.redirect(`/users/${userId}`);
})

module.exports = router;