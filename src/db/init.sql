CREATE TABLE stock (
    id text PRIMARY KEY UNIQUE,
    guild_id bigint UNIQUE,
    invite text UNIQUE,
    total_shares int[],
    price int[],
    market_cap bigint[]
    change_time bigint[]
);