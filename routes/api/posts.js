const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Post = require('../../models/Post');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// add a post
router.post('/', upload.single('postImage'), async (req, res) => {
  try {
    const newPost = new Post({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      desc: req.body.desc,
      postImage: req.file.path,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get a post by its id
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// update post
router.put('/:id', upload.single('postImage'), async (req, res) => {
  const { title, desc, postImage } = req.body;

  // Build post object
  const postFields = {};
  postFields.title = title;
  postFields.desc = desc;
  postFields.postImage = postImage;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post = await Post.findByIdAndUpdate(req.params.id, {
      $set: postFields,
    });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// to delete a post by id
router.delete('/:postId', async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.postId);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
