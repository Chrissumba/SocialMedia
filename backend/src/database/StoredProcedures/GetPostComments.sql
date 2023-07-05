CREATE PROCEDURE GetPostComments
  @postId INT
AS
BEGIN
  SELECT c.*, u.id AS userId, u.name, u.profilePic
  FROM Comments AS c
  JOIN Users AS u ON u.id = c.userId
  WHERE c.postId = @postId
  ORDER BY c.createdAt DESC;
END;
