CREATE TABLE stocks (
    id text PRIMARY KEY UNIQUE,
    guild_id bigint UNIQUE,
    invite text UNIQUE,
    members int[],
    total_shares int[],
    time_stamp bigint[]
);