const Blog = require('../models/Blog');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

const getBlogs = async (req, res) => {
  try {
    const { category, tag, search, status, sort, page = 1, limit = 6 } = req.query;
    let filter = {};

    // If request has authorization and is validated in routes, we can show drafts.
    // By default, public API only sees 'published'.
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'published';
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    let blogs = await Blog.find(filter).sort({ createdAt: -1 });

    if (tag) {
      blogs = blogs.filter(b => b.tags && b.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      blogs = blogs.filter(b => 
        b.title.toLowerCase().includes(searchLower) ||
        b.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort order
    if (sort === 'popular') {
      blogs.sort((a, b) => b.views - a.views);
    } else {
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const total = blogs.length;
    const startIndex = (page - 1) * limit;
    const paginatedBlogs = blogs.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      blogs: paginatedBlogs,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count
    blog.views = (blog.views || 0) + 1;
    await Blog.findByIdAndUpdate(blog._id, { views: blog.views });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, coverImage, content, category, tags, status, seoTitle, seoDescription, readTime } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content and category are required' });
    }

    let slug = slugify(title);
    // Check if slug exists, append random if it does
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const calculatedReadTime = readTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    const newBlog = await Blog.create({
      title,
      slug,
      coverImage: coverImage || '',
      content,
      category,
      tags: tags || [],
      status: status || 'draft',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.substring(0, 150),
      readTime: calculatedReadTime
    });

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, coverImage, content, category, tags, status, seoTitle, seoDescription, readTime } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    let slug = blog.slug;
    if (title && title !== blog.title) {
      slug = slugify(title);
      const existing = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    const calculatedReadTime = readTime || (content ? Math.max(1, Math.ceil(content.split(/\s+/).length / 200)) : blog.readTime);

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title !== undefined ? title : blog.title,
        slug,
        coverImage: coverImage !== undefined ? coverImage : blog.coverImage,
        content: content !== undefined ? content : blog.content,
        category: category !== undefined ? category : blog.category,
        tags: tags !== undefined ? tags : blog.tags,
        status: status !== undefined ? status : blog.status,
        seoTitle: seoTitle !== undefined ? seoTitle : blog.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : blog.seoDescription,
        readTime: calculatedReadTime
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};
