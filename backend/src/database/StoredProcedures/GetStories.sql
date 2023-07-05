CREATE PROCEDURE [dbo].[GetStories]
  @userId INT
AS
BEGIN
  SELECT *
  FROM Stories
  WHERE userId = @userId;
END;
EXEC [dbo].[GetStories] @userId = 3;
