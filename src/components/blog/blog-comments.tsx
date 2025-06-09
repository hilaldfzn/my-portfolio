"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { MessageCircle, Reply, Heart, Flag } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface Comment {
  id: number
  author: string
  email: string
  content: string
  createdAt: string
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface BlogCommentsProps {
  postId: number
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah Johnson",
      email: "sarah@example.com",
      content:
        "Great article! This really helped me understand the concepts better. I've been struggling with connecting Next.js to Django, and your explanation made it so much clearer.",
      createdAt: "2024-01-16T10:30:00Z",
      likes: 5,
      replies: [
        {
          id: 2,
          author: "John Doe",
          email: "john@example.com",
          content: "Thanks Sarah! I'm glad it was helpful. Feel free to reach out if you have any questions.",
          createdAt: "2024-01-16T11:00:00Z",
          likes: 2,
          replies: [],
        },
      ],
    },
    {
      id: 3,
      author: "Mike Chen",
      email: "mike@example.com",
      content: "Could you write a follow-up article about deployment strategies for this stack? That would be amazing!",
      createdAt: "2024-01-16T14:20:00Z",
      likes: 8,
      replies: [],
    },
  ])

  const [newComment, setNewComment] = useState({
    author: "",
    email: "",
    content: "",
  })

  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const comment: Comment = {
      id: Date.now(),
      author: newComment.author,
      email: newComment.email,
      content: newComment.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    }

    setComments([...comments, comment])
    setNewComment({ author: "", email: "", content: "" })
    setIsSubmitting(false)

    toast({
      title: "Comment posted!",
      description: "Your comment has been added successfully.",
    })
  }

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const reply: Comment = {
      id: Date.now(),
      author: "You", // In real app, get from auth
      email: "you@example.com",
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )

    setReplyContent("")
    setReplyingTo(null)
    setIsSubmitting(false)

    toast({
      title: "Reply posted!",
      description: "Your reply has been added successfully.",
    })
  }

  const handleLikeComment = (commentId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                }
              : reply,
          ),
        }
      }),
    )
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-4 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`} />
          <AvatarFallback>
            {comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm leading-relaxed">{comment.content}</p>
          <div className="flex items-center space-x-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id)}
              className={`h-auto p-1 ${comment.isLiked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
              {comment.likes}
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="h-auto p-1"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground">
              <Flag className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-11 space-y-3">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplyingTo(null)
                setReplyContent("")
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Name *</Label>
                <Input
                  id="author"
                  value={newComment.author}
                  onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Comment *</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts..."
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}