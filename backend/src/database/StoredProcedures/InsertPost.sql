CREATE PROCEDURE InsertPost
    @description NVARCHAR(MAX),
    @img NVARCHAR(MAX),
    @userId INT
AS
BEGIN
    INSERT INTO posts (description, img, userId, createdAt)
    VALUES (@description, @img, @userId, GETDATE());
END
EXEC InsertPost
    @description = 'This is the post description',
    @img = 'image.jpg',
    @userId = 1;
