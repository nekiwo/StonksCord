CREATE TABLE stocks (
    id text PRIMARY KEY UNIQUE,
    guild_id bigint UNIQUE,
    invite text UNIQUE,
    members int[],
    total_shares int[],
    time_stamps timestamp without time zone[]
);

CREATE TABLE users (
    id bigint PRIMARY KEY UNIQUE,
    balance int,
    stocks text[] -- ['test 54']
);