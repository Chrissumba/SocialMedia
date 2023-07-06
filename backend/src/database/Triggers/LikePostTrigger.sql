CREATE TRIGGER likePostTrigger
ON Likes
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @likedUserId INT;
  DECLARE @postOwnerId INT;
  DECLARE @notificationDescription VARCHAR(MAX);

  -- Retrieve the liked user ID and post owner ID
  SELECT @likedUserId = l.userId, @postOwnerId = p.userId
  FROM Likes AS l
  INNER JOIN Posts AS p ON p.id = l.postId
  WHERE l.id = (SELECT id FROM inserted);

  -- Retrieve the name of the person who liked the post
  DECLARE @likedUserName VARCHAR(255);
  SELECT @likedUserName = u.name
  FROM Users AS u
  WHERE u.id = @likedUserId;

  -- Create a notification description
  SET @notificationDescription = CONCAT(@likedUserName, ' liked your post');

  -- Insert a new row in the Notifications table
  INSERT INTO Notifications (userId, sourceId, description)
  VALUES (@postOwnerId, @likedUserId, @notificationDescription);
END;
