# initialize house database
DROP TABLE IF EXISTS houses;
CREATE TABLE houses
(
    id   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64)
);
ALTER TABLE houses
    AUTO_INCREMENT = 1000;
INSERT INTO houses(name)
VALUES ('House Chandris'),
       ('House Aria'),
       ('House Lockril'),
       ('House Noctum');

#initialize house member database
DROP TABLE IF EXISTS house_members;
CREATE TABLE house_members
(
    id   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64)
);
ALTER TABLE house_members
    AUTO_INCREMENT = 1000;
INSERT INTO house_members(name) VALUE ('Sylvie Nightclaw'), ('Will Krokker'), ('Arty Strongheart');

#initialize house points database
DROP TABLE IF EXISTS house_points;
CREATE TABLE house_points
(
    house  INT REFERENCES houses (id),
    member INT REFERENCES house_members (id),
    points INT
);

#set points function
DROP PROCEDURE IF EXISTS modify_points;
DELIMITER $$
CREATE PROCEDURE modify_points(IN house VARCHAR(64), IN member VARCHAR(64), IN points INT, IN increment BOOLEAN)
modifyPointsLabel: BEGIN
    SET @house_id = (SELECT id FROM houses WHERE name = house);
    SET @member_id = (SELECT id FROM house_members WHERE name = member);

    IF (@house_id is NULL) THEN
        LEAVE modifyPointsLabel;
    END IF;

    IF (@member_id is NULL) THEN
        INSERT INTO house_members(name) VALUE (member);
        SET @member_id = (SELECT id FROM house_members WHERE name = member);
    END IF;

    #get the point modifier value (0 for set, current for increment)
    SET @current_points = 0;
    IF increment THEN
        SET @current_points =
                (SELECT house_points.points
                 from house_points
                 WHERE house_points.house = @house_id
                   AND house_points.member = @member_id);
    END IF;

    #Remove duplicates before adding new value
    DELETE FROM house_points WHERE house_points.house = @house_id AND house_points.member = @member_id;
    INSERT INTO house_points VALUE (@house_id, @member_id, (@current_points + points));
END $$;
DELIMITER ;

CALL modify_points('House Aria', 'Sylvie Nightclaw', 200, false);
CALL modify_points('House Aria', 'Charlie Nightclaw', 250, false);
CALL modify_points('House Aria', 'Charlie Nightclaw', 100, true);


# methods:
# get all data neatly formatted
# get total points for a house


SELECT *
from houses;
SELECT *
from house_members;
SELECT *
from house_points;