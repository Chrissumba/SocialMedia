CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(1000) NOT NULL,
  name VARCHAR(255) NOT NULL,
  coverPic VARCHAR(1000),
  profilePic VARCHAR(1000),
  city VARCHAR(255),
  website VARCHAR(255)
);
CREATE TABLE Posts (
  id INT PRIMARY KEY IDENTITY(1,1),
  description VARCHAR(MAX),
  img VARCHAR(MAX),
  userId INT FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  createdAt DATETIME
);

CREATE TABLE Comments (
  id INT PRIMARY KEY IDENTITY(1,1),
  description VARCHAR(MAX) NOT NULL,
  createdAt DATETIME,
  userId INT NOT NULL,
  postId INT NOT NULL
);



CREATE TABLE Stories (
  id INT PRIMARY KEY IDENTITY(1,1),
  img VARCHAR(MAX) NOT NULL,
   createdAt DATETIME,
  userId INT NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Follow (
  id INT PRIMARY KEY IDENTITY(1,1),
  followerUserId INT NOT NULL,
  followedUserId INT NOT NULL,
  CONSTRAINT FK_Follow_Users1 FOREIGN KEY (followerUserId) REFERENCES Users(id),
  CONSTRAINT FK_Follow_Users2 FOREIGN KEY (followedUserId) REFERENCES Users(id)
);

CREATE TABLE Likes (
  id INT PRIMARY KEY IDENTITY(1,1),
  userId INT NOT NULL,
  postId INT NOT NULL,
  CONSTRAINT FK_Likes_Users FOREIGN KEY (userId) REFERENCES Users(id),
  CONSTRAINT FK_Likes_Posts FOREIGN KEY (postId) REFERENCES Posts(id)
);

CREATE TABLE Notifications(
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    userid INT NOT NULL,
    sourceid INT NOT NULL,
	 description VARCHAR(MAX),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userid) REFERENCES Users(id),
	FOREIGN KEY (sourceid) REFERENCES Users(id)
    )

 CREATE TABLE Replies (
  id INT PRIMARY KEY IDENTITY(1,1),
  postId INT NOT NULL,
  commentId INT NOT NULL,
  description VARCHAR(MAX) NOT NULL,
  personId INT NOT NULL,
  createdAt DATETIME,
  FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (commentId) REFERENCES Comments(id),
  FOREIGN KEY (personId) REFERENCES Users(id) 
);
CREATE TABLE Recommendations (
  id INT PRIMARY KEY IDENTITY(1, 1),
  userId INT NOT NULL,
  recommendedUserId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT GETDATE(),
  -- Add any other columns related to recommendations if needed
);


DROP TABLE Notifications
CREATE TRIGGER TR_Comments_Delete
ON Comments
AFTER DELETE
AS
BEGIN
  DELETE FROM Comments WHERE postId IN (SELECT id FROM deleted);
END;

CREATE TRIGGER TR_Comments_Update
ON Comments
AFTER UPDATE
AS
BEGIN
  UPDATE Comments SET postId = i.postId
  FROM Comments c
  INNER JOIN inserted i ON c.id = i.id;
END;


ALTER TABLE Notifications
ADD isRead BIT NOT NULL DEFAULT 0;
