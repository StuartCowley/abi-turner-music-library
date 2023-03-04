CREATE TABLE Albums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date INT NOT NULL,
    artistId INT NOT NULL,

    CONSTRAINT FK_artist_info FOREIGN KEY (artistId)
    REFERENCES artists(id)
);