CREATE PROCEDURE DeleteComment
  @commentId INT
AS
BEGIN
  DELETE FROM Comments
  WHERE id = @commentId
END;
