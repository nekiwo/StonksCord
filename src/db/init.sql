CREATE SEQUENCE stock_seq START WITH 0 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE stock (
    id text PRIMARY KEY,
    guild_id bigint UNIQUE,
    invite text UNIQUE,
    total_shares int,
    cost int,
    market_cap bigint
);