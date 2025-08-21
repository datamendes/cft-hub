import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  Reply, 
  Heart, 
  ThumbsUp, 
  Smile, 
  MoreVertical, 
  Edit, 
  Trash2,
  AtSign,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { useCollaboration, type Comment, type User } from '@/hooks/use-collaboration';

interface CommentSystemProps {
  itemId: string;
  itemType: 'document' | 'proposal' | 'meeting';
}

interface CommentItemProps {
  comment: Comment;
  itemId: string;
  onReply: (parentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, emoji: string) => void;
  currentUser: User;
  level?: number;
}

function CommentItem({ 
  comment, 
  itemId, 
  onReply, 
  onEdit, 
  onDelete, 
  onReaction, 
  currentUser,
  level = 0 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReactions, setShowReactions] = useState(false);

  const handleEdit = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const reactions = ['👍', '❤️', '😊', '🎉', '👏'];

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-border' : ''}`}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>
              {comment.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <Badge variant="outline" className="text-xs">
                  {comment.author.role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
                {comment.updatedAt && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </div>
              
              {comment.author.id === currentUser.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(comment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-sm"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground">{comment.content}</p>
                
                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <AtSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Mentioned {comment.mentions.length} user(s)
                    </span>
                  </div>
                )}

                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {comment.attachments.length} attachment(s)
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Reactions */}
                  {comment.reactions && comment.reactions.length > 0 && (
                    <div className="flex items-center gap-1">
                      {comment.reactions.map((reaction) => (
                        <Button
                          key={reaction.emoji}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => onReaction(comment.id, reaction.emoji)}
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <DropdownMenu open={showReactions} onOpenChange={setShowReactions}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Smile className="h-3 w-3 mr-1" />
                          React
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <div className="flex items-center gap-1 p-2">
                          {reactions.map((emoji) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                onReaction(comment.id, emoji);
                                setShowReactions(false);
                              }}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={() => onReply(comment.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              itemId={itemId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReaction={onReaction}
              currentUser={currentUser}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSystem({ itemId, itemType }: CommentSystemProps) {
  const {
    getItemComments,
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    currentUser,
    isLoading,
  } = useCollaboration();

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const comments = getItemComments(itemId);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await addComment(itemId, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    
    try {
      await addComment(itemId, replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
    setReplyContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments</h3>
        <Badge variant="outline">{comments.length}</Badge>
      </div>

      {/* New Comment */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <AtSign className="h-3 w-3 mr-1" />
                    Mention
                  </Button>
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-3 w-3 mr-1" />
                    Attach
                  </Button>
                </div>
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Be the first to leave a comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                itemId={itemId}
                onReply={handleReply}
                onEdit={(commentId, content) => updateComment(itemId, commentId, content)}
                onDelete={(commentId) => deleteComment(itemId, commentId)}
                onReaction={(commentId, emoji) => addReaction(itemId, commentId, emoji)}
                currentUser={currentUser}
              />
              
              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-6 mt-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback className="text-xs">
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyContent.trim() || isLoading}
                            >
                              Reply
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}