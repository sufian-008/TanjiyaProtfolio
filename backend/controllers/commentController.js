const Comment = require('../models/Comment');

// Structuring nested replies
const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    // Fetch all approved comments for this blog post
    const comments = await Comment.find({ blogId, isApproved: true, isSpam: false }).sort({ createdAt: 1 });
    
    const commentMap = {};
    const rootComments = [];

    // Map comments and initialize replies array
    comments.forEach(comment => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });

    // Nest replies
    comments.forEach(comment => {
      const mapped = commentMap[comment._id];
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(mapped);
        } else {
          // If parent is deleted or not approved, treat as root
          rootComments.push(mapped);
        }
      } else {
        rootComments.push(mapped);
      }
    });

    res.json(rootComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create visitor comment
const createComment = async (req, res) => {
  try {
    const { blogId, parentId, author, content } = req.body;

    if (!blogId || !content) {
      return res.status(400).json({ message: 'Blog ID and content are required' });
    }

    // Basic spam filter
    const spamWords = ['buy bitcoin', 'cheap viagra', 'spam link', 'free money'];
    const isSpam = spamWords.some(word => content.toLowerCase().includes(word));

    const newComment = await Comment.create({
      blogId,
      parentId: parentId || null,
      author: author || 'Anonymous Visitor',
      content,
      isApproved: false, // Moderation required
      isSpam
    });

    res.status(201).json({
      message: 'Comment submitted. It will appear once approved by the administrator.',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a comment
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { likes: (comment.likes || 0) + 1 },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Report comment
const reportComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { reported: true },
      { new: true }
    );
    res.json({ message: 'Comment reported', comment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADMIN CMS METHODS ---

// Get all comments for management (grouped or paginated)
const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve comment
const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isSpam: false },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin reply (auto-approved)
const replyAsAdmin = async (req, res) => {
  try {
    const { blogId, parentId, content } = req.body;

    if (!blogId || !parentId || !content) {
      return res.status(400).json({ message: 'Missing blogId, parentId, or content' });
    }

    const newComment = await Comment.create({
      blogId,
      parentId,
      author: 'Tanjiya Nowrin (Admin)',
      content,
      isApproved: true,
      isSpam: false
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete or flag comment as spam
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Delete children comments if any to clean up replies tree
    const replies = await Comment.find({ parentId: req.params.id });
    for (const reply of replies) {
      await Comment.findByIdAndDelete(reply._id);
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment and its nested replies deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle spam flag
const toggleSpamComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { isSpam: !comment.isSpam, isApproved: comment.isSpam ? true : false },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsByBlog,
  createComment,
  likeComment,
  reportComment,
  getAllCommentsAdmin,
  approveComment,
  replyAsAdmin,
  deleteComment,
  toggleSpamComment
};
