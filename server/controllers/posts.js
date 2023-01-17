import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import user from "../models/user.js";

export const getAllPosts = async (req, res) => {
  try {
      const postMessages = await PostMessage.aggregate([ { $sample: { size: 9 } } ]) //.sort( { createAt: -1 } )

      res.status(200).json(postMessages)

  }catch(error){
      res.status(404).json({message: error.message})
  }
}

export const getPosts = async (req, res) => {
  console.log('my followings posts')
    const followingUsers = req.body.user.following
    followingUsers.push(req.body.userId)
    console.log(followingUsers)
    
    
  let allposts = [];

  for (let i = 0; i < followingUsers.length; i++) {
    const userPost = await user.findById(followingUsers[i]);

    for (let j=0; j<userPost.uploades.length; j++){

        if(!mongoose.Types.ObjectId.isValid(userPost.uploades[j].toString())) return console.log('No post with that id')
        const post = await PostMessage.findById(userPost.uploades[j].toString())
        allposts = [...allposts, post]
    }
  }
  try {
    
    allposts.sort(function(a, b){return b.createAt-a.createAt});
    res.status(200).json(allposts);
    console.log(allposts.length)
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  console.log('addPost....')
  const { userId, ...post } = req.body;

  const userID = req.userId;

  const owner = await user.findById(userID);

  const newPost = new PostMessage({
    ...post,
    creator: userID,
    createAt: new Date().toString(),
    username: owner.username,
    profileImg: owner.profileImg,
  });

  const updated = await user.findByIdAndUpdate(userID, {
    uploades: [...owner.uploades, newPost.id],
  });

  if (!updated) return console.log("error");

  try {
    await newPost.save();
    console.log('done')
    res.status(200).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
 
  const { id: _id } = req.params;
  const post = req.body;

  if (mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  res.json(updatePost);
};

export const deletePost = async (req, res) => {
  const { id, creator } = req.params;

  const owner = await user.findById(creator);

  const updated = owner.uploades.filter(
    (post) => post.toString() !== id.toString()
  );

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  await PostMessage.findByIdAndRemove(id);
  await user.findByIdAndUpdate(creator, { uploades: updated });
  res.json({ message: "Post Deleted Successfully" });
  console.log("Post Deleted Successfully");
};

export const likePost = async (req, res) => {
  console.log("liked");
  const { id } = req.params;

  if (!req.userId) res.json({ message: "Uauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(id);
  const index = post.likes.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedpost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedpost);
};
