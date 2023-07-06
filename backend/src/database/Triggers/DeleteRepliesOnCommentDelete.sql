CREATE TRIGGER DeleteRepliesOnCommentDelete
ON Comments
AFTER DELETE
AS
BEGIN
  DELETE FROM Replies
  WHERE commentId IN (SELECT id FROM deleted);
END;
