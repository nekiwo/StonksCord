CREATE TABLE stocks (
    id text PRIMARY KEY UNIQUE,
    guild_id bigint UNIQUE,
    invite text UNIQUE,
    members int[],
    price decimal[],
    total_shares int[],
    time_stamps timestamp without time zone[]
);

CREATE TABLE users (
    id bigint PRIMARY KEY UNIQUE,
    balance decimal,
    stocks text[] -- ['test 54']
);

CREATE TABLE stockID /* STOCK ID HERE */ (
    id text PRIMARY KEY UNIQUE,
    time_stamps timestamp without time zone[]
);