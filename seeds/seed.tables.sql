BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Gaelic', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'aon', 'one', 2),
  (2, 1, 'dhà', 'two', 3),
  (3, 1, 'trì', 'three', 4),
  (4, 1, 'ceithir', 'four', 5),
  (5, 1, 'còig', 'five', 6),
  (6, 1, 'sia', 'six', 7),
  (7, 1, 'seachd', 'seven', 8),
  (8, 1, 'ochd', 'eight', 9),
  (9, 1, 'naoi', 'nine', 10),
  (10, 1, 'deich', 'ten', 11),
  (11, 1, 'alba', 'scotland', 12),
  (12, 1, 'uisge', 'water', 13),
  (13, 1, 'uisge-beatha', 'whisky', 14),
  (14, 1, 'cofaidh', 'coffee', 15),
  (15, 1, 'tì', 'tea', 16),
  (16, 1, 'agus', 'and', 17),
  (17, 1, 'dubh', 'black', 18),
  (18, 1, 'geal', 'white', 19),
  (19, 1, 'slàinte', 'cheers', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
