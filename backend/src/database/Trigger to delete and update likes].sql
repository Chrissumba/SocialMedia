CREATE TRIGGER TR_Likes_Delete
ON Likes
AFTER DELETE
AS
BEGIN
  DELETE FROM Likes WHERE postId IN (SELECT id FROM deleted);
END;

CREATE TRIGGER TR_Likes_Update
ON Likes
AFTER UPDATE
AS
BEGIN
  UPDATE Likes SET postId = i.postId
  FROM Likes l
  INNER JOIN inserted i ON l.id = i.id;
END;