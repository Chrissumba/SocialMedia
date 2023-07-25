CREATE TRIGGER TR_Notifications_AfterUpdate
ON Notifications
AFTER UPDATE
AS
BEGIN
  IF UPDATE(isRead)
  BEGIN
    DELETE FROM Notifications WHERE isRead = 1;
  END
END;
