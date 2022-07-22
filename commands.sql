CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer,
);

\d blogs

insert into blogs (author, url, title, likes) values ('DDQuin', 'www.google.com', 'Coding is fun!', 0);
insert into blogs (author, url, title, likes) values ('Bob', 'www.yahoo.com', 'Why you shouldnt use ORMs', 5);