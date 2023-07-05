CREATE PROCEDURE InsertLike
    @userId INT,
    @postId INT
AS
BEGIN
    INSERT INTO Likes (userId, postId)
    VALUES (@userId, @postId);
END
EXEC InsertLike @userId = 1, @postId = 123;
