CREATE TRIGGER trg_UpdateRecommendations
ON dbo.Follow
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if the inserted followerUserId is in the Recommendations table
    IF EXISTS (
        SELECT 1
        FROM Recommendations
        WHERE userId = (SELECT followerUserId FROM INSERTED)
    )
    BEGIN
        -- Delete the corresponding record from the Recommendations table
        DELETE FROM Recommendations
        WHERE userId = (SELECT followerUserId FROM INSERTED);
    END
END;
