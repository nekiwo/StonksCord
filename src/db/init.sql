CREATE SEQUENCE stock_seq

CREATE TABLE stock (
    id text PRIMARY KEY,
    guild_id bigint UNIQUE,
    invite text UNIQUE,
    total_shares int,
    cost int,
    market_cap bigint
);