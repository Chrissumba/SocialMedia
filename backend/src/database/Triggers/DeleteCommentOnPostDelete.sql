CREATE TRIGGER DeleteCommentsOnPostDelete
ON Posts
AFTER DELETE
AS
BEGIN
  DELETE FROM Comments
  WHERE postId IN (SELECT id FROM deleted)
END;
