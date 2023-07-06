CREATE TRIGGER followUserTrigger
ON Follow
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @followerUserId INT;
  DECLARE @followedUserId INT;
  DECLARE @notificationDescription VARCHAR(MAX);

  -- Retrieve the follower user ID and followed user ID
  SELECT @followerUserId = f.followerUserId, @followedUserId = f.followedUserId
  FROM Follow AS f
  WHERE f.id = (SELECT id FROM inserted);

  -- Retrieve the name of the follower user
  DECLARE @followerUserName VARCHAR(255);
  SELECT @followerUserName = u.name
  FROM Users AS u
  WHERE u.id = @followerUserId;

  -- Create a notification description
  SET @notificationDescription = CONCAT(@followerUserName, ' followed you');

  -- Insert a new row in the Notifications table
  INSERT INTO Notifications (userId, sourceId, description)
  VALUES (@followedUserId, @followerUserId, @notificationDescription);
END;
