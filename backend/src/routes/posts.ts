import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { protectedRoute } from "../middleware/auth";
import { validate } from "../middleware/validation";

const router = Router();

const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
});

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: id as string },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

router.post("/", protectedRoute, validate(postSchema), async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.userId;

    if (!authorId) return res.status(401).json({ error: "Unauthorized" });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: authorId!,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
});

router.put("/:id", protectedRoute, validate(postSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    const post = await prisma.post.findUnique({
      where: { id: id as string },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === "ADMIN";

    if (post.authorId !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: id as string },
      data: {
        title,
        content,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

router.delete("/:id", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await prisma.post.findUnique({
      where: { id: id as string },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === "ADMIN";

    if (post.authorId !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    const deletedPost = await prisma.post.delete({
      where: { id: id as string },
    });

    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

export default router;
