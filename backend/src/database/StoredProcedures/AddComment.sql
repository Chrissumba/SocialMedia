CREATE PROCEDURE AddComment
  @postId INT,
  @userId INT,
  @description VARCHAR(MAX),
  @createdAt DATETIME
AS
BEGIN
  INSERT INTO Comments (postId, userId, description, createdAt)
  VALUES (@postId, @userId, @description, @createdAt)
END;
