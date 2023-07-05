CREATE PROCEDURE InsertFollow
    @followerUserId INT,
    @followedUserId INT
AS
BEGIN
    INSERT INTO Follow (followerUserId, followedUserId)
    VALUES (@followerUserId, @followedUserId);
END
EXEC InsertFollow @followerUserId = 1, @followedUserId = 2;
