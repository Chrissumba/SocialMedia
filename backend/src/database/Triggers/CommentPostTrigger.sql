CREATE TRIGGER commentPostTrigger
ON Comments
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @commentedUserId INT;
  DECLARE @postId INT;
  DECLARE @notificationDescription VARCHAR(MAX);

  -- Retrieve the commented user ID and post ID
  SELECT @commentedUserId = c.userId, @postId = c.postId
  FROM Comments AS c
  WHERE c.id = (SELECT id FROM inserted);

  -- Retrieve the name of the commented user
  DECLARE @commentedUserName VARCHAR(255);
  SELECT @commentedUserName = u.name
  FROM Users AS u
  WHERE u.id = @commentedUserId;

  -- Create a notification description
  SET @notificationDescription = CONCAT(@commentedUserName, ' commented on your post');

  -- Insert a new row in the Notifications table
  INSERT INTO Notifications (userId, sourceId, description)
  SELECT p.userId, @commentedUserId, @notificationDescription
  FROM Posts AS p
  WHERE p.id = @postId;
END;
