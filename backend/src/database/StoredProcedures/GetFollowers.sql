CREATE PROCEDURE GetFollowers
    @followedUserId INT
AS
BEGIN
    SELECT id, username, email, name, coverPic, profilePic, city, website
    FROM Users
    WHERE id IN (
        SELECT followerUserId
        FROM Follow
        WHERE followedUserId = @followedUserId
    )
END
EXEC GetFollowers @followedUserId = 123;
