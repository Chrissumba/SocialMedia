CREATE TRIGGER TR_Comments_Delete
ON Comments
AFTER DELETE
AS
BEGIN
  DELETE FROM Comments WHERE postId IN (SELECT id FROM deleted);
END;

CREATE TRIGGER TR_Comments_Update
ON Comments
AFTER UPDATE
AS
BEGIN
  UPDATE Comments SET postId = i.postId
  FROM Comments c
  INNER JOIN inserted i ON c.id = i.id;
END;