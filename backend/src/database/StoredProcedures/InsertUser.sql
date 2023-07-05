CREATE PROCEDURE InsertUser
  @username VARCHAR(255),
  @email VARCHAR(255),
  @password VARCHAR(1000),
  @name VARCHAR(255)
AS
BEGIN
  INSERT INTO Users (username, email, password, name)
  VALUES (@username, @email, @password, @name)
END;


