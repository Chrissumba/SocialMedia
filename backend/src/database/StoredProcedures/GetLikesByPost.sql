CREATE PROCEDURE GetLikesByPostId
    @postId INT
AS
BEGIN
    SELECT userId
    FROM Likes
    WHERE postId = @postId;
END
EXEC GetLikesByPostId @postId = 123;
