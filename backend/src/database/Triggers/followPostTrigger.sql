CREATE TRIGGER folowPostTrigger
ON Posts
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @postId INT;
  DECLARE @followerUserId INT;

  -- Retrieve the post ID
  SELECT @postId = id FROM inserted;

  -- Get the follower user IDs and names
  DECLARE @followerUsers TABLE (followerUserId INT, followerUserName VARCHAR(255));
  INSERT INTO @followerUsers (followerUserId, followerUserName)
  SELECT f.followerUserId, u.name
  FROM Follow AS f
  INNER JOIN Users AS u ON u.id = f.followerUserId
  WHERE f.followedUserId = (SELECT userId FROM Posts WHERE id = @postId);

  -- Insert notifications for each follower
  INSERT INTO Notifications (userId, sourceId, description)
  SELECT fu.followerUserId, (SELECT userId FROM Posts WHERE id = @postId), fu.followerUserName + ' has made a post'
  FROM @followerUsers AS fu;
END;
