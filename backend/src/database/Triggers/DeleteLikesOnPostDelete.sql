CREATE TRIGGER DeleteLikesOnPostDelet
ON Posts
AFTER DELETE
AS
BEGIN
  DELETE FROM Likes
  WHERE postId IN (SELECT id FROM deleted)
END;
