CREATE PROCEDURE DeleteLike
    @userId INT,
    @postId INT
AS
BEGIN
    DELETE FROM Likes
    WHERE userId = @userId AND postId = @postId;
END
EXEC DeleteLike @userId = 1, @postId = 123;
